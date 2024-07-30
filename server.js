const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
<<<<<<< HEAD
const bcrypt = require('bcryptjs');  // 改为 bcryptjs
=======
const bcrypt = require('bcrypt');
>>>>>>> b02ab5cfc03a33a6a60a297103a8ea9186673223

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
