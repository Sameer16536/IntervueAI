import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary} from "cloudinary";
import { configDotenv } from "dotenv";


//Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

configDotenv()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})