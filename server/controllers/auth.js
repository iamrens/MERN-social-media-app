import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import validator from "validator";

// REGISTER USER
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    // validation
    if (!email || !password || !firstName || !lastName ) {
        throw new Error('Please provide the required fields');
    }
    if (!validator.isEmail(email)){
        throw new Error('Invalid email format.');
    }
    if (!validator.isStrongPassword(password)){
        throw new Error('Password must be strong. Use at least 8 characters, including uppercase letters, digits, and symbols.');
    }
    if (req.file && !['image/jpg', 'image/png', 'image/jpeg'].includes(req.file.mimetype)) {
      throw new Error('Invalid image format.');
    }
    if (req.file && req.file.size > 2097152) {
      throw new Error("Image must be less than 2mb");
    }

    // Default picture if there will be no uploaded image
    const firstNameInitial = firstName.charAt(0).toUpperCase();
    const defaultProfile = `https://ui-avatars.com/api/?name=${firstNameInitial}&background=random&color=random&rounded=true&bold=true`;

    let picturePath = defaultProfile;
    if (req.file && req.file.path) {
      picturePath = req.file.path;
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // check if email already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use.');
    }

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGGING IN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate email and password
    if (!email || !password) {
        throw new Error("Please provide both email and password");
    }
  
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email format.');
    }

    // check if user exist
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error("User does not exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Wrong email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};