const {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
  } = require("./emailTemplates.js");
  
  const { sendEmail, sender } = require("./nodemailer.config.js");
  
 
  
  const sendVerificationEmail = async (email, otp) => {
	const subject = "Verify your email";
	const html = VERIFICATION_EMAIL_TEMPLATE.replace("{otp}", otp);
  
	try {
	  const response = await sendEmail(sender.email, email, subject, html);
	  console.log("Verification email sent successfully", response);
	} catch (error) {
	  console.error("Error sending verification email", error);
	  throw new Error(`Error sending verification email: ${error}`);
	}
  };
  
  const sendWelcomeEmail = async (email, name) => {
	const subject = "Welcome to Auth Company!";
	const html = `
	  <p>Hi ${name},</p>
	  <p>Welcome to Auth Company!</p>
	  <p>We're glad to have you on board.</p>
	  <p>Best regards,<br>Auth Company</p>
	`;
  
	try {
	  const response = await sendEmail(sender.email, email, subject, html);
	  console.log("Welcome email sent successfully", response);
	} catch (error) {
	  console.error("Error sending welcome email", error);
	  throw new Error(`Error sending welcome email: ${error}`);
	}
  };
  
  const sendPasswordResetEmail = async (email, resetURL) => {
	const subject = "Reset your password";
	const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);
  
	try {
	  const response = await sendEmail(sender.email, email, subject, html);
	  console.log("Password reset email sent successfully", response);
	} catch (error) {
	  console.error("Error sending password reset email", error);
	  throw new Error(`Error sending password reset email: ${error}`);
	}
  };
  
  const sendResetSuccessEmail = async (email) => {
	const subject = "Password Reset Successful";
	const html = PASSWORD_RESET_SUCCESS_TEMPLATE;
  
	try {
	  const response = await sendEmail(sender.email, email, subject, html);
	  console.log("Password reset success email sent successfully", response);
	} catch (error) {
	  console.error("Error sending password reset success email", error);
	  throw new Error(`Error sending password reset success email: ${error}`);
	}
  };
  
  module.exports = {
	sendVerificationEmail,
	sendWelcomeEmail,
	sendPasswordResetEmail,
	sendResetSuccessEmail,
  };
  