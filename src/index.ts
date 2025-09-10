import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import userRouter from "./routers/user.router";

const app = express();

configDotenv()
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] === "http") {
    res.redirect(`https://${req.headers.host}${req.url}`);
    return;
  }
  next();
});
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});