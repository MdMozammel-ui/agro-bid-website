const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");

const router = express.Router();


// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, password and role are required.",
      });
    }

    if (!["buyer", "farmer", "seller"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be buyer, farmer or seller.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const [existingUsers] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        email,
        hashedPassword,
        role,
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Registration successful.",
      user: {
        id: result.insertId,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to register user.",
    });
  }
});


// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        role
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const user = users[0];

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to login.",
    });
  }
});


// =========================
// GET CURRENT USER
// =========================
router.get("/me", async (req, res) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization token is required.",
      });
    }

    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE id = ?
      `,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    res.json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token.",
    });
  }
});


module.exports = router;