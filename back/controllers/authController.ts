import { Request, Response } from "express";
import User from "../models/userModel";
import { generateTokens } from "../utils/generateTokens";
import { OAuth2Client } from "google-auth-library";

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

    const { accessToken, refreshToken } = generateTokens({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

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
