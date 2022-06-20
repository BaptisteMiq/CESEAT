const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExt = file.originalname.split(".").pop();
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExt);
    },
});

const upload = multer({ storage: storage });

const app = express();

app.post("/profile", upload.single("avatar"), function (req, res, next) {
    return res.json({
        success: true,
        message: "File uploaded successfully",
        path: req.file.path,
    });
});

app.use("/", express.static("uploads"));

app.listen(3001, () => {
    console.log("CDN running at localhost:3001");
});
