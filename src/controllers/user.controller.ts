import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userInputValidation } from "../utils/types";

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
    if(existingUser){
        res.status(409).json({
            message:"User Already exists"
        })
        return
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password,10)

    
  } catch (err) {
    throw err;
    console.error("Error in Register User", err);
  }
};
