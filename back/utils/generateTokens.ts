import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export const generateTokens = (userPayload: TokenPayload) => {

  const accessToken = jwt.sign(userPayload, process.env.JWT_TOKEN!, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { userId: userPayload.userId },
    process.env.REFRESH_TOKEN!,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
