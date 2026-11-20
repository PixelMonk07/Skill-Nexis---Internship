import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check whether the Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. Token required."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store authenticated user's information in the request
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
}

export default authMiddleware;