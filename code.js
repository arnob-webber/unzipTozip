const express = require('express');
const multer = require('multer');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3000;

// "public" directory
app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    if (path.extname(file.originalname) !== '.zip') {
        return res.status(400).send('Only .zip files are allowed.');
    }

    const filePath = path.join(__dirname, file.path);
    const unzipPath = path.join(__dirname, 'uploads', path.basename(file.originalname, '.zip'));

    const zip = new AdmZip(filePath);
    zip.extractAllTo(unzipPath, true);

    fs.unlinkSync(filePath); // remove the uploaded zip file

    res.send('File unzipped successfully.');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
