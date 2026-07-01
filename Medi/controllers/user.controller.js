const User = require("../models/user.models")
const jwt = require("jsonwebtoken")

const generateToken = (id) => {
  const payload = { id: id }
  const option = {
    expiresIn: "7d"
  }

  const token = jwt.sign(payload, process.env.SECRET_KEY, option);
  return token;
}


//sign up controller
const signUp = async (req, res) => {
  const { name, email, password, role } = req?.body
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" })
  }
  try {
    //check user already exist or not
    const checkExistOrNot = await User.findOne({ email })
    if (checkExistOrNot) {
      return res.status(409).json({ success: false, message: "User Already Exist" })
    }

    //create user in database
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User SignUp Successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const login = async (req, res) => {
  const { email, password } = req?.body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" })
  }
  try {
    const userFind = await User.findOne({ email }).select("+password")
    if (!userFind) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    const isPasswordMatch = await userFind.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: userFind._id,
        name: userFind.name,
        email: userFind.email,
        role: userFind.role,
        token: generateToken(userFind._id),
        user: {
          name: userFind.name,
          email: userFind.email,
          role: userFind.role,
        }
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { signUp, login }
