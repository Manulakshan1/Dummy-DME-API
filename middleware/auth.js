import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

export function authRequired(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = { userId: payload.sub, username: payload.username };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function signAuthToken(user) {
  const payload = { sub: user._id.toString(), username: user.username };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }); // Shorter expiry for access token
}

export function signRefreshToken(user) {
  const payload = { sub: user._id.toString(), username: user.username, type: "refresh" };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // Longer expiry for refresh token
}

export function verifyRefreshToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== "refresh") {
      throw new Error("Invalid token type");
    }
    return payload;
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
}


