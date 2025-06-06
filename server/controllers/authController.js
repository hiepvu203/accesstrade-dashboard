const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const refreshTokens = [];

const authController = {
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user)
                return res.status(400).json({ message: "Email is incorrect!" });
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ message: "Password is incorrect!" });

            const accessToken = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_SECRET || "secretkey",
                { expiresIn: "15m" } // access token ngắn hạn
            );
            const refreshToken = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_REFRESH_SECRET || "refreshsecretkey",
                { expiresIn: "7d" }
            );
            refreshTokens.push(refreshToken);
            res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, username: user.username } });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server!" })
        }
    },
    refreshToken: (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken || !refreshTokens.includes(refreshToken)) {
            return res.status(403).json({ message: "Refresh token không hợp lệ!" });
        }
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refreshsecretkey");
            const accessToken = jwt.sign(
                { id: decoded.id, email: decoded.email },
                process.env.JWT_SECRET || "secretkey",
                { expiresIn: "15m" }
            );
            res.json({ accessToken });
        } catch (err) {
            return res.status(403).json({ message: "Refresh token hết hạn hoặc không hợp lệ!" });
        }
    },
    registerUser: async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã tồn tại!" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new User({
                email,
                username,
                password: hashedPassword
            });
            await newUser.save();
            res.status(201).json({ message: "Đăng ký thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server!" });
        }
    }
};

module.exports = authController;