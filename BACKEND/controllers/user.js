const Userdoc = require("../models/userDoc.js");
const ProfileDoc = require("../models/ProfileDoc.js");
const CommDoc = require("../models/CommunicationId.js");
const { SaveAuthentication } = require("../authentication/userAuth.js");
const crypto = require("crypto");
const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");




async function LoginHandler(req, res) {
  const { password, username, email } = req.body;


  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }


  if (!username && !email) {
    return res.status(400).json({ error: "Username or email is required" });
  }

  try {

    const key = username ? "username" : "email";
    const value = username || email;


    const user = await findAccount(req, res, key, value);
    if (user == null) return res.status(404).json({ error: "Invalid username or email" });


    const accessToken = verifyAccountAndSaveAuthentication(req.body.password, user);


    if (!accessToken) {
      return res.status(400).json({ error: "Incorrect password" });
    }


    const UserData = {
      id: user._id,
      username: user.username,
      email: user.email
    };


    res.status(200).json({ message: "Login successful", accessToken, UserData });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

}

async function SignupHandler(req, res) {
  const { username, fullname, email, password } = req.body;

  // Validate input fields
  if (!username || !fullname || !email || !password ||
    username === "" || fullname === "" || email === "" || password === "") {
    return res.status(404).json({ error: "Enter all Details" });
  }

  try {
    // Check for duplicacy
    const value = await checkDuplicacy(username, email);
    if (value) {
      return res.status(404).json({ error: `${value} already exists` });
    }

    // Prepare user data
    const UserData = {
      fullname: fullname,
      username: username,
      email: email,
    };

    // Hash password and add salt
    const { salt, hashpassword } = HashedPasswordAndSalting(password);

    // Add hashed password and salt to the user data
    UserData.password = hashpassword;
    UserData.salting = salt;



    // Save user to the database
    const newAccount = await Userdoc.create(UserData);

    //create user Profile
    const defaultImage = getDefaultImage();

    const ProfileData = {
      userAccId: newAccount._id,
      username: username,
      fullname: fullname,
      email: email,
      profileImage: defaultImage

    }

    const newProfile = await ProfileDoc.create(ProfileData);

    // const objectId = newProfile._id; 
    // const stringId = objectId.toString();
  
    

    // const commId = generateCommunicationId(stringId);

    // const CommInfo = {
    //   userId: newProfile._id,
    //   commId: commId
    // }

    // const newComm = await CommDoc.create(CommInfo);

    return res.status(201).json({ message: "SignUp Successfully", newAccount });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Sign up failed", details: error.message });
  }
}


async function NewProfileHandler(req, res) {

  let NewProfileData = {};

  const { id } = req.body;

  if (req.body.fullname) {
    const fullname = req.body.fullname;
    if (fullname === "") {
      return res.status(400).json({ error: "Full name cannot be empty" });
    }
    NewProfileData.fullname = fullname;
  }

  if (req.body.username) {
    const username = req.body.username;
    if (username === "") {
      return res.status(400).json({ error: "Username cannot be empty" });
    }
    NewProfileData.username = username;
  }

  if (req.body.bio) {
    const bio = req.body.bio;
    NewProfileData.bio = bio;
  }


  if (req.file) {
    const profile = req.file;
    const newProfileImage = {
      data: profile.buffer,
      contentType: profile.mimetype,
    };
    NewProfileData.profileImage = newProfileImage;
  }

  try {

    if (NewProfileData.username) {
      const existingUser = await findAccount(req, res, "username", NewProfileData.username);
      if (existingUser) {
        return res.status(400).json({ error: `Username ${NewProfileData.username} already exists` });
      }
    }

    // existing details -> 
    const existingDetails = await ProfileDoc.findById(id);
    const existingUsername = existingDetails.username;

    const updateUserAccount = await Userdoc.findOneAndUpdate({ username: existingUsername }, {
      username: NewProfileData.username,
      fullname: NewProfileData.fullname

    }, { new: true });

    const updatedProfile = await ProfileDoc.findByIdAndUpdate(id, NewProfileData, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ message: "Profile Updated Successfully", updatedProfile });

  } catch (error) {

    res.status(500).json({ error: "Server error: " + error.message });
  }
}

async function fetchProfileDetails(req, res) {

  const id = req.params.id;

  try {

    const userProfile = await ProfileDoc.findOne({ userAccId: id });

    if (!userProfile) return res.status(404).json({ error: "profile not found" });

    return res.status(202).json({ message: "user profile sended", userProfile });

  }
  catch (error) {
    res.status(404).json({ error: "internal error" })
  }

}


async function fetchAllAccounts(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }



  try {

    const allAccounts = await ProfileDoc.find({ email: { $ne: email } }).limit(4);


    res.status(202).json({ allAccounts });
  } catch (error) {

    res.status(505).json({ error: error.message });
  }
}


async function fetchOtherProfile(req, res) {

  const id = req.params.id;

  try {

    const userProfile = await ProfileDoc.findOne({ _id: id });

    if (!userProfile) return res.status(404).json({ error: "profile not found" });

    return res.status(202).json({ message: "user profile sended", userProfile });

  }
  catch (error) {
    res.status(404).json({ error: "internal error" })
  }

}

async function SearchUsers(req, res) {

  const { username } = req.query;

  if (!username || username == "") return res.send("");

  let query = ProfileDoc.find();

  if (username != "" || username != null) {
    query = query.regex("username", new RegExp(username, "i"));
  }

  try {

    const searchedAccounts = await query.exec();
    if (!searchedAccounts || searchedAccounts == "") return res.status(404).json({ message: "No accounts found" });

    res.status(202).json({ searchedAccounts });

  }
  catch (error) {

    res.status(505).json({ error: error.message })
  }


}

async function fetchCommunicationId(req, res) {

  const id = req.params.id;

  if (!id || id == "") return res.status(404).json({ message: "ID REQURIED" });

  try {

    const commId = await CommDoc.findOne({ userId: id });
    if (!commId) return res.status(404).json({ message: "no comm id" });

    res.status(202).json({ commId });

  }
  catch (err) {
    res.status(505).json({ error: err.message });
  }

}

async function addCommIds(req, res) {

  const id = req.params.id;
  try {

    const commId = generateCommunicationId(id);

    const CommInfo = {
      userId: id,
      commId: commId
    }

    const newComm = await CommDoc.create(CommInfo);

    res.status(202).json({ newComm });

  }

  catch (error) {
    res.status(505).json({ error: error.message });
  }

}


// other function 

const otps = {};

function generateCommunicationId(userId) {

  const commId = crypto.createHmac("sha256", process.env.COMMUICATION_KEY).update(userId).digest("hex");

  return commId;

}

async function GenerateOTP(req, res) {


  console.log("the otps container ->" , otps);

  const { email } = req.body;
  console.log(email);


  if (!email || email == "") {
    return res.status(400).json({ message: "email required" });
  }


  try {


    const user = await findAccount(req, res, "email", email);

    if (!user || user == "") return res.status(404).json({ message: "Invalid email" });


    // saved temporary  and deleted after verification

    const OTP = Math.floor(Math.random() * 90000) + 10000;
    const userId = user._id;

    otps[userId] = { OTP: OTP, expires: Date.now() + 20 * 1000 };

    res.status(200).json({ userId: userId, OTP });

  } catch (error) {

    return res.status(500).json({ error: error.message });

  }

}

async function VerifyOTP(req, res) {
  const { userId, enteredOTP } = req.body;

  try {
   
    if (!otps[userId]) {
      console.log("Invalid OTP, request a new one.");
      return res.status(401).json({ message: "Invalid OTP, request a new one." });
    }

    const { expires, OTP } = otps[userId];
    
    if (Date.now() > expires) {
      console.log("OTP expired, try again later" );
      return res.status(410).json({ message: "OTP expired, try again later" });
    }
    
    if (OTP != enteredOTP) {
      console.log("wrong otp req");
      return res.status(400).json({ message: "Wrong OTP" });
    }

    


    delete otps[userId];

  
    const keyId = crypto
      .createHmac("sha256", process.env.OTP_KEY)
      .update(userId)
      .digest("base64");

  
    res.status(202).json({ message: "OTP verified", keyId: keyId });

  } catch (error) {
  
    res.status(500).json({ error: error.message });
  }
}

async function resetPassword(req, res) {


  const { keyId, userId, newPassword } = req.body;
 
  const { salt, hashpassword } = HashedPasswordAndSalting(newPassword);

  try {

    const newkeyId = crypto.createHmac("sha256", process.env.OTP_KEY).update(userId).digest("base64");
    if (keyId != newkeyId) {
      return res.status(404).json({ error: "invalid id's" });
    }

     await Userdoc.findByIdAndUpdate(
      userId,
      {
        password: hashpassword,
        salting: salt
      },
      { new  : true }
    );

    res.status(200).json({ message: "password changed " });
  }
  catch (error) {

    res.status(505).json({ error: "Internal error " })
  }


}

async function checkValidParams(req ,res) {
   
const { id1, id2 } = req.params;


const newkeyId = crypto.createHmac("sha256", process.env.OTP_KEY).update(id1).digest("base64");
console.log(newkeyId);

if(newkeyId != id2) { 
  return res.status(404).json({ message : "invalid id's" });

}

res.status(202).json({ message : "valid keys"  });

}

async function findAccount(req, res, key, value) {
  try {
    let user = null;


    if (key === "username") {
      user = await Userdoc.findOne({ username: value });
    } else if (key === "email") {
      user = await Userdoc.findOne({ email: value });
    }


    if (user) {
      return user;
    }

    return null;



  } catch (error) {

    return res.status(500).json({ error: "Something went wrong", details: error.message });
  }
}

function verifyAccountAndSaveAuthentication(userProvidedPassword, user) {


  const newHashPassword = crypto.createHmac("sha256", user.salting).update(userProvidedPassword).digest("hex");


  if (newHashPassword != user.password) return null;

  const UserData = {

    id: user._id,
    username: user.username,
    email: user.email
  }


  const accessToken = SaveAuthentication(UserData);
  return accessToken;

}

async function checkDuplicacy(username, email) {
  try {
    // Check if the username already exists
    const userWithSameUsername = await Userdoc.findOne({ username: username });
    if (userWithSameUsername) return "username";  // Found duplicate username

    // Check if the email already exists
    const userWithSameEmail = await Userdoc.findOne({ email: email });
    if (userWithSameEmail) return "email";  // Found duplicate email

    return false;  // No duplicacy found
  } catch (error) {
    throw new Error("Error checking duplicacy: " + error.message);  // Throw error to be handled in SignupHandler
  }
}

function HashedPasswordAndSalting(password) {

  const salt = crypto.randomBytes(20).toString("hex");
  const hashpassword = crypto.createHmac("sha256", salt).update(password).digest("hex");

  return { salt, hashpassword };

}

function getDefaultImage() {

  const actualPath = "/home/varun/Personal-data/FULL STACK DEVLOPMENT/GIT-HUB/TalksGram/BACKEND/public/default.jpg";

  const imagePath = path.resolve(actualPath);
  const imageBuffer = fs.readFileSync(imagePath);


  return {
    data: imageBuffer,
    contentType: "image/jpeg"
  }
}

async function renderImage(req, res) {

  try {

    const profile = await ProfileDoc.findOne({ _id: req.params.id });

    if (!profile || !profile.profileImage || !profile.profileImage.data) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.contentType(profile.profileImage.contentType);
    res.send(profile.profileImage.data);
  }
  catch (error) {
    res.status(404).json({ error: "error fetching image" })
  }

}

function multerStorage() {

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  return upload;
}


module.exports = {

  LoginHandler,
  SignupHandler,
  NewProfileHandler,
  fetchProfileDetails,
  fetchAllAccounts,
  fetchOtherProfile,
  SearchUsers,
  GenerateOTP,
  resetPassword,
  checkValidParams,
  fetchCommunicationId,
  VerifyOTP,
  addCommIds,
  renderImage,
  multerStorage

}