// controllers/userPController.js
const UserP = require("../models/userPharmaSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, contact, password, role, pharmacy } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserP({
      name,
      email,
      contact,
      password: hashedPassword,
      normalpass: password,
      role,
      pharmacy: role === "medical" ? pharmacy : undefined,
    });

    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserP.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, "Pharma", {
      expiresIn: "24h",
    });

    res.send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserP.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await UserP.findByIdAndDelete(id);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a user's password by ID
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).send("New password is required");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find the user and update the password
    const updatedUser = await UserP.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("Password updated successfully");
  } catch (error) {
    res.status(400).send(error);
  }
};
