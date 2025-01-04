import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { generateTokens } from "../utils/generateTokens";

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(403).json({
      message: "No refresh token provided",
    });
    console.log("No refresh token provided");
    return;
  }

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.status(403).json({
        message: "Invalid refresh token",
      });
      console.log("Invalid refresh token:", refreshToken);
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN!,
      (err: jwt.VerifyErrors | null) => {
        if (err) {
          return res.status(403).json({
            message: "Refresh token expired or tampered with",
          });
        } else {
          const { accessToken } = generateTokens({
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          });
  
          return res.status(200).json({ accessToken });
        }
      }
    );
  } catch (err) {
    console.error("Server error during the refresh token process:", err);
    res.status(500).json({
      message: "Server error, please try again later",
    });
  }
};

export const handleTokenVerification = (req: Request, res: Response) => {
  if ((req as any).user) {
    res.status(200).json({
      isValid: true,
      user: (req as any).user,
    });
  } else {
    res.status(401).json({ isValid: false });
  }
};
