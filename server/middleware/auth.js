const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Không có token, truy cập bị từ chối." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
}

module.exports = authMiddleware;