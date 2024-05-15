import { Request, Response } from "express";
import User from "../models/authModel";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const { sub: googleId, email, name } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ googleId, email, name });
    }

    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_TOKEN!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN!,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .json({ user, token: accessToken, refreshToken: refreshToken });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed", error });
  }
};
