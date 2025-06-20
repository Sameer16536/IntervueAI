import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { loginInputValidation, userInputValidation } from "../utils/types";

const prisma = new PrismaClient();

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // Limit each IP to 25 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "2h",
    }
  );
};

const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validateInput = userInputValidation.parse(req.body);
    const { email, name, password, role } = validateInput;

    //Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        message: "User Already exists",
      });
      return;
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    //Generate Token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //send refresh token as cookie ??
    res.status(201).json({
      message: "User Created successfully",
      user,
      accessToken,
      refreshToken,
    });
    return;
  } catch (err) {
    console.error("Error in Register User", err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validateInput = loginInputValidation.parse(req.body);
    const { email, password } = validateInput;

    //Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (
      !existingUser ||
      !existingUser.password ||
      (await bcrypt.compare(password, existingUser.password))
    ) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const accessToken = generateAccessToken(existingUser)
    const refreshToken = generateRefreshToken(existingUser)

  } catch (err) {
    console.error("Error while Login", err);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
