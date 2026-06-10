import { verifyAccess } from "../utils/jwt.js";

export function auth(req, res, next) {
    const hdr = req.headers.authorization;
    if (!hdr?.startsWith("Bearer "))
        return res.status(401).json({ error: "missing token" });
    try {
        const token = hdr.slice("Bearer ".length);
        const payload = verifyAccess(token);
        if (!payload) return res.status(401).json(
            { error: "invalid token" }
        );
        
        // Attach the user payload to the request object
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ error: "invalid or expired token" });
    }
}