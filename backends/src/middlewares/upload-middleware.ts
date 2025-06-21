import multer from "multer";

export function uploadMiddleware() {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        cb(null, true);
      } else {
        cb(new Error("File harus berupa Excel (.xlsx)"));
      }
    },
  });
}
