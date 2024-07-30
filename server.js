const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('public'));

// Data storage (in-memory for simplicity, use a database in production)
let programs = [
    { id: 1, name: '节目一', photo: 'uploads/photo1.jpg' },
    { id: 2, name: '节目二', photo: 'uploads/photo2.jpg' }
];
let votes = {};
const adminPasswordHash = bcrypt.hashSync('admin123', 10); // 预先加密密码

// Routes
app.get('/programs', (req, res) => {
    res.json(programs);
});

app.post('/vote', (req, res) => {
    const { programId } = req.body;
    const ip = req.ip;
    votes[ip] = votes[ip] || [];

    if (votes[ip].length >= 2) {
        return res.json({ success: false, message: '您只能投两次票。' });
    }

    if (votes[ip].includes(programId)) {
        return res.json({ success: false, message: '您不能对同一个节目投票两次。' });
    }

    votes[ip].push(programId);
    res.json({ success: true });
});

app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    if (bcrypt.compareSync(password, adminPasswordHash)) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/admin/reset-votes', (req, res) => {
    votes = {};
    res.json({ success: true });
});

app.post('/programs', (req, res) => {
    const { name } = req.body;
    if (!req.files || !req.files.photo) {
        return res.status(400).send('没有上传文件。');
    }

    const photo = req.files.photo;
    const uploadPath = path.join(__dirname, 'public/uploads', photo.name);

    photo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        const newProgram = {
            id: programs.length + 1,
            name: name,
            photo: `uploads/${photo.name}`
        };
        programs.push(newProgram);
        res.json({ success: true });
    });
});

app.post('/admin/background', (req, res) => {
    if (!req.files || !req.files.background) {
        return res.status(400).send('没有上传文件。');
    }

    const background = req.files.background;
    const uploadPath = path.join(__dirname, 'public', background.name);

    background.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({ success: true, url: background.name });
    });
});

app.get('/statistics', (req, res) => {
    const programVotes = programs.map(program => {
        const voteCount = Object.values(votes).flat().filter(id => id === program.id).length;
        return { name: program.name, votes: voteCount };
    });
    res.json(programVotes);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
