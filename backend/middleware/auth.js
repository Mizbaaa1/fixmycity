const User = require("../models/User");

async function auth(req, res, next) {
    try {
        const userId = req.headers["user-id"];

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({
                message: "Invalid user."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        res.status(500).json({
            message: "Authentication failed."
        });
    }
}

module.exports = auth;