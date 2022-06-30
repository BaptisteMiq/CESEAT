const express = require("express");
const multer = require("multer");
const cors = require("cors");

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
app.use(cors());

app.post("/upload", upload.single("image"), function (req, res, next) {
    // Remove the beggining "uploads" from path
    const path = req.file.path.replace(/^uploads/, "");
    return res.json({
        success: true,
        message: "File uploaded successfully",
        path,
    });
});

app.use("/", express.static("uploads"));

app.listen(3001, () => {
    console.log("CDN running at localhost:3001");
});
