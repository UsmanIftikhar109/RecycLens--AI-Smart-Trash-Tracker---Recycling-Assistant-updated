const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendResetEmail } = require("../utils/email");

// ─── Import the Mongoose User model ─────────
// This replaces getDb() + db.collection("users").
// All queries, validation, and password hashing
// are handled through the model.
const User = require("../models/User");

// ═══════════════════════════════════════════════
//  REGISTER  →  POST /api/auth/register
// ═══════════════════════════════════════════════
router.post("/register", async (req, res) => {
  const { fullName, username, email, password, phone } = req.body;

  try {
    // ── Validate required fields ────────────
    const nameValue = (fullName || username || "").trim();
    if (!nameValue || !email || !password) {
      return res
        .status(400)
        .json({ error: "fullName, email and password are required" });
    }

    // ── Create a new user via Mongoose ──────
    // • email is auto-lowercased & trimmed by the schema
    // • password is auto-hashed by the pre("save") hook
    // • timestamps (createdAt, updatedAt) are added automatically
    const user = await User.create({
      fullName: nameValue,
      email: email,
      password: password,
      phone: phone ? String(phone).trim() : undefined,
    });

    // ── Respond with the created user ───────
    res.status(201).json({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
    });
  } catch (err) {
    // Mongoose duplicate-key error (email already exists)
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Mongoose validation error (missing/invalid fields)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
//  LOGIN  →  POST /api/auth/login
// ═══════════════════════════════════════════════
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ── Validate required fields ────────────
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "email and password are required" });
    }

    // ── Find user by email ──────────────────
    // .select("+password") is not needed here because
    // password is not hidden by default in our schema.
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // ── Verify password ─────────────────────
    // Uses the comparePassword() instance method
    // defined in the User model.
    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // ── Generate JWT ────────────────────────
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );

    // ── Respond with token + user data ──────
    res.json({
      token,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
//  FORGOT PASSWORD  →  POST /api/auth/forgot-password
// ═══════════════════════════════════════════════
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set token and expiry (1 hour from now)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Send email
    await sendResetEmail(user.email, resetToken);

    res.json({ message: "Password reset email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
//  RESET PASSWORD  →  POST /api/auth/reset-password
// ═══════════════════════════════════════════════
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  try {
    // Find user with valid token and not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Update password (the pre('save') hook in User model will hash it)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
