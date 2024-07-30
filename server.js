const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const bcryptjs = require('bcryptjs');  // 使用 bcryptjs

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example route to handle file upload
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.photo) {
        return res.status(400).send('No files were uploaded.');
    }

    const photo = req.files.photo;
    const uploadPath = path.join(__dirname, 'public', 'uploads', photo.name);

    photo.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send('File uploaded!');
    });
});

// Example API route
app.post('/vote', (req, res) => {
    // Handle voting logic here
    res.json({ success: true });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
