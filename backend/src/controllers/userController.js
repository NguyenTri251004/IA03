const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../middleware/auth');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register controller
exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password } = value;

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email đã được sử dụng' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ name, email, password: hashed });
    await user.save();

    // Send response
    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database
    user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
    await user.save();

    // Return tokens
    res.status(200).json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Refresh token controller
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token không được cung cấp' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    // Check if refresh token exists in database
    if (!user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ message: 'Refresh token không hợp lệ' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh tokens (remove old one, add new one)
    user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.status(200).json({
      message: 'Làm mới token thành công',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get user profile (protected route)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.status(200).json({
      message: 'Lấy thông tin người dùng thành công',
      user
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Logout controller
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(200).json({ message: 'Đăng xuất thành công' });
    }

    // Find user
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded) {
      const user = await User.findById(decoded.userId);
      if (user) {
        // Remove refresh token from database
        user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
        await user.save();
      }
    }

    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
