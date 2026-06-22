const nodemailer = require('nodemailer');

const sendResetEmail = async (email, token) => {
  const resetUrl = `https://recyclens.com/reset-password?token=${token}`; // Placeholder URL

  // In a real app, you would use actual credentials from process.env
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: '"RecycLens" <noreply@recyclens.com>',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please use the following token to reset your password: ${token}\n\nOr click here: ${resetUrl}`,
      html: `<p>You requested a password reset. Please use the following token to reset your password: <strong>${token}</strong></p><p>Or click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    // If email fails (e.g. no SMTP config), we still return success in a "mock" way for dev
    // but log it. In production, this should be a real error.
    if (!process.env.EMAIL_USER) {
      console.log(`[MOCK EMAIL] Reset link for ${email}: ${resetUrl}`);
      return { success: true, mock: true };
    }
    throw error;
  }
};

module.exports = { sendResetEmail };
