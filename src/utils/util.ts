import multer  from "multer";


export const upload = multer({
  storage: multer.memoryStorage(), // In-memory storage (RAM)
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});