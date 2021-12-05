const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./config/db');

app.use(express.json());

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');
app.use(express.static('public'));
connectDB();

app.use('/fileShare', (req, res) => {
    res.render('home');
})
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'))

app.use('files/download', require('./routes/download'));
app.listen(3000, () => {
    console.log('Listening on port');
})