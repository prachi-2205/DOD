const { google } = require("googleapis");
const oAuth = google.auth.OAuth2;
const nodemailer = require("nodemailer");
const oAuthClient = new oAuth(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // Redirect URL
);
oAuthClient.setCredentials({
  refresh_token: process.env.REFRESSTOKEN_SECRET,
});

const sendMailService = async (user, verification) => {
  const accessToken = await new Promise((resolve, reject) => {
    oAuthClient.getAccessToken((err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.REFRESSTOKEN_SECRET,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Email Verification",
    text: `Click on the link to verify your email: ${process.env.CLIENT_URL}/api/auth/verify-email?email=${user.email}&token=${verification.token}`,
  };
  try {
    const mail = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info.messageId);
        }
      });
    });
    return mail;
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = { sendMailService };
