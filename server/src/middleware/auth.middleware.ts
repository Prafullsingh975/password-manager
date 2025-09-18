import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request interface to include the user property
export interface IAuthRequest extends Request {
  user?: { id: string };
}

export const protect = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      user: { id: string };
    };
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
