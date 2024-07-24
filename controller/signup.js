const User = require("../models/user");
const { createSecretToken } = require("../tokenGeneration/generateToken");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword } = req.body;

    console.log("log -------> name", name);
    console.log("log -------> username", username);
    console.log("log -------> email", email);
    console.log("log -------> password", password);
    console.log("log -------> confirmPassword", confirmPassword);

    if (!(name && username && email && password && confirmPassword)) {
      return res.status(400).send("All input is required");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      path: "/", // Cookie is accessible from all paths
      expires: new Date(Date.now() + 86400000), // Cookie expires in 1 day
      secure: true, // Cookie will only be sent over HTTPS
      httpOnly: true, // Cookie cannot be accessed via client-side scripts
      sameSite: "None",
    });

    console.log("cookie set successfully");

    res.status(201).json(user);
  } catch (error) {
    console.log("Got an error", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = createUser;
