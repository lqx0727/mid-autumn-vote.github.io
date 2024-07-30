const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'your_password') {  // 使用实际的密码
        res.json({ success: true });
    } else {
        res.json({ success: false, message: '密码错误' });
    }
});

app.post('/programs', (req, res) => {
    if (req.files && req.files.photo) {
        // 处理上传文件
        res.json({ success: true });
    } else {
        res.json({ success: false, message: '上传失败' });
    }
});

app.post('/admin/background', (req, res) => {
    if (req.files && req.files.background) {
        const background = req.files.background;
        const uploadPath = path.join(__dirname, 'public', 'uploads', background.name);
        background.mv(uploadPath, (err) => {
            if (err) return res.status(500).send(err);
            res.json({ success: true, url: `/uploads/${background.name}` });
        });
    } else {
        res.json({ success: false, message: '请选择一张照片。' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
