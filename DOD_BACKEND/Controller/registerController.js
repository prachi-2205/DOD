const db = require("../models/index");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const jwt = require("jsonwebtoken");
const { sendMailService } = require("../Service/sendMailVerifiactionService");
const { use } = require("../routes/authRoutes");

const registerUser = async (req, res) => {
  const userdata = req.body;

  // Implement the logic to save the data to the database
  // Hash the password before saving it to the database
  const salt = await bcrypt.genSaltSync(10);
  const hashed_password = bcrypt.hashSync(userdata.password, salt);
  const data = {
    email: userdata.email,
    password: hashed_password || userdata.password,
    first_Name: userdata.first_name || null,
    last_Name: userdata.last_name || null,
    phone_number: userdata.phone_number || null,
    username: userdata.username || null,
    refferal_code: userdata.refferal_code || null,
    Address: userdata.Address || null,
  };

  data.password = hashed_password;
  const user = await db.users.create(data);

  const verification = await verificationService(user);
  //Mail Verification
  await sendMailService(user, verification);

  // OTP Verification

  sendSms(user.phone_number, process.env.TWILIO_NUMBER, verification.code);
  await db.onboarding.create({
    status: "PENDING",
    user_id: user.id,
  });
  res.status(200).json({ data: user, message: "User registered successfully" });
};

const sendSms = async (caller, twilioNumber, otp) => {
  const response = await client.messages.create({
    body: `Your otp is:${otp}`, // Message body
    from: `whatsapp:+${process.env.TWILIO_NUMBER}`, // Your Twilio phone number (e.g., +1234567890)
    to: `whatsapp:+${caller}`, // The user's phone number (e.g., +0987654321)
  });
  return response;
};
const login = async (req, res) => {
  const data = req.body;

  const user = await db.users.findOne({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const token = await generateAuthToken(user);
  const sendata = {
    token: token,
    userData: user,
  };
  res
    .status(200)
    .json({ data: sendata, message: "User logged in successfully" });
};
const logout = async (req, res) => {
  const data = req.body;
  console.log(data);
};

const generateAuthToken = async (user) => {
  const adminPrivateKeyPath = path.join(__dirname, "../storage/privatekey.key");

  const adminPrivateKey = fs.readFileSync(adminPrivateKeyPath, "utf8");

  let verifyOptions = {
    algorithm: "RS256",
    expiresIn: "3d",
  };

  const token = jwt.sign({ id: user.id }, adminPrivateKey, verifyOptions);
  return token;
};
const forgotPassword = async (req, res) => {
  const data = req.body;

  const user = await db.users.findOne({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }

  const password = await bcrypt.compare(data.password, user.password);

  if (password) {
    return res.status(400).json({ message: "Please Enter New Password" });
  } else {
    const salt = await bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(data.password, salt);
    user.save();
  }
  return res.status(200).json({ message: "Password Changed Successfully" });
};
const resetPassword = async (req, res) => {
  const data = req.body;
  console.log(data);
};
const changePassword = async (req, res) => {
  const data = req.body;
  console.log(data);
  const user = await db.users.findOne({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }

  const isMatch = await bcrypt.compare(data.old_password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }
  const salt = await bcrypt.genSaltSync(10);
  const hashed_password = bcrypt.hashSync(data.password, salt);
  user.password = hashed_password;
  user.save();
  return res.status(200).json({ message: "Password Changed Successfully" });
};
const verifyEmail = async (req, res) => {
  const data = req.query;

  const user = await db.users.findOne({
    where: {
      email: data.email,
    },
  });

  if (user) {
    const userData = await db.user_verifications.findOne({
      where: {
        user_id: user.id,
      },
    });

    userData.verified_time = new Date();
    userData.is_verified = true;
    userData.save();
    user.is_verified = true;
    user.email_verified_at = new Date();
    user.save();
    return res.status(200).json({ message: "Succesfully Verifed" });
  }
  return res.status(200).json({ message: "Please Try Again" });
};
const verifyCode = async (req, res) => {
  const otp = req.body;
  const user = await db.users.findOne({
    phone_number: otp.phone_number,
  });
  const verification_data = await db.user_verifications.findOne({
    where: {
      user_id: user.id,
    },
  });

  if (verification_data.code === otp.code) {
    const current_time = moment().toDate();
    if (current_time > verification_data.expired_time) {
      return res.status(400).json({ message: "Code Expired" });
    }

    verification_data.is_verified = true;
    verification_data.code = null;
    verification_data.expired_time = null;
    verification_data.verified_time = new Date();
    verification_data.save();
    return res.status(200).json({ message: "Succesfully Verifed" });
  }
  res.status(400).json({ message: "Invalid Code" });
};

const verificationService = async (user) => {
  const current_time = moment();
  const expired_time = current_time.add(15, "minute");
  const [verifcation, create] = await db.user_verifications.findOrCreate({
    where: {
      user_id: user.id,
    },
    defaults: {
      code: Math.floor(100000 + Math.random() * 900000),
      token: crypto.randomBytes(30).toString("hex"),
      expired_time: expired_time.toDate(),
      is_verified: false,
      verified_time: null,
    },
  });
  if (!create) {
    (verifcation.code = Math.floor(100000 + Math.random() * 900000)),
      (verifcation.token = crypto.randomBytes(30).toString("hex")),
      (verifcation.expired_time = expired_time.toDate()),
      (verifcation.is_verified = false),
      (verifcation.verified_time = null),
      await verifcation.save();
  }
  return verifcation;
};

const setUpProfile = async (req, res) => {
  const userData = req.body;
  const user = req.user ? req?.user?.id : req.body.userID;
  console.log(userData, user);
  const [data, created] = await db.onboarding.findOrCreate({
    where: {
      user_id: user,
    },
    defaults: {
      status: "COMPLETED",
      first_Name: userData.firstName,
      last_Name: userData.lastName,
      bio: userData.bio || null,
    },
  });
  console.log(data, created);
  if (!created) {
    console.log("here");
    data.firstName = userData.firstName;
    data.lastName = userData.lastName;
    data.bio = userData.bio || null;
    data.status = "COMPLETED";
    console.log("Da", data);
    await data.save();
  }
  res.status(200).json({ message: "Profile Updated Successfully" });
};

const profileImage = async (req, res) => {
  const user = req.user ? req?.user?.id : req.body.userID;
  const file = req.file;
  const entityType = req.params.entityType;
  const entityId = req.params.entityId;
  console.log("user file", file);

  const mediaData = await db.media.findOne({
    where: {
      entity_type: entityType,
      entity_id: entityId,
      media_type: "Profile",
    },
  });
  if (mediaData) {
    mediaData.media_url = file.path;
    mediaData.size = file.size;
    mediaData.mime_type = file.mimetype;
    mediaData.name = file.originalname;
    mediaData.path = file.path;
    mediaData.ext = path.extname(file.originalname).substring(1);
    await mediaData.save();
  } else {
    mediaData = await db.media.create({
      user_id: user,
      entity_type: entityType,
      entity_id: entityId,
      media_type: "Profile",
      media_url: file.path,
      size: file.size,
      mime_type: file.mimetype,
      name: file.originalname,
      path: file.path,
      ext: path.extname(file.originalname).substring(1),
    });
  }

  res
    .status(200)
    .json({ data: mediaData, message: "Profile Image Updated Successfully" });
};
module.exports = {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  verifyCode,
  setUpProfile,
  profileImage,
};
