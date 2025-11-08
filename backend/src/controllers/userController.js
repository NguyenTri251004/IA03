const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

exports.register = async (req, res) => {
  try {
    // Debug: log incoming registration attempt (never log raw passwords in production)
    if (process.env.NODE_ENV !== 'production') {
      const safePasswordInfo = req.body?.password ? { length: String(req.body.password.length) } : {};
      console.log('Register attempt:', { email: req.body?.email, password: safePasswordInfo });
    }
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    // check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email đã được sử dụng' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hashed });
    await user.save();

    // send limited info back
    res.status(201).json({ message: 'Đăng ký thành công', user: { id: user._id, email: user.email, createdAt: user.createdAt } });
  } catch (err) {
    console.error('Register error:', err && err.stack ? err.stack : err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    // success - return limited user info
    return res.status(200).json({ message: 'Đăng nhập thành công', user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};
