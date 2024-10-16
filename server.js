const { S3 } = require('@aws-sdk/client-s3'); // Ensure correct import
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const app = express();
const port = 5000;

// AWS S3 Configuration
const s3 = new S3({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// CORS Middleware
app.use(cors());

// Multer Storage
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

// Upload Endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ fileUrl: req.file.location });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
