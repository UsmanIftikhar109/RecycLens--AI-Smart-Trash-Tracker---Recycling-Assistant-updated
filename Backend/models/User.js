// ─── User Model (Mongoose) ──────────────────
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    scansCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Hash password before saving to the database
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare a candidate password with the stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
