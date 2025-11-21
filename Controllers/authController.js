import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user = null;

    // vérifier si existe déjà
    if (role === "patient") {
      user = await User.findOne({ email });
    } else {
      user = await Doctor.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        email,
        password: hashPassword,
        name,
        role,
        photo,
        gender
      });
    }

    if (role === "doctor") {
      user = new Doctor({
        email,
        password: hashPassword,
        name,
        role,
        photo,
        gender
      });
    }

    await user.save();

    res.status(200).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;

    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) user = patient;
    else if (doctor) user = doctor;
    else return res.status(400).json({ status: false, message: "User does not exist" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ status: false, message: "Invalid credentials" });
    }

    const token = generateToken(user);
    const { password: pwd, ...userData } = user._doc;

    res.status(200).json({
      status: true,
      message: "Successful Login",
      token,
      data: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Failed To Login" });
  }
};