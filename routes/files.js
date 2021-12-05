const router = require('express').Router();
const multer = require("multer");
const path = require('path');
const file = require('../models/file');
const { v4: uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cd) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);

    }
})
let upload = multer({
    storage: storage,
    limit: { fileSize: 1000000 * 100 },
}).single('myfile');

router.post('/', (req, res) => {

    upload(req, res, async (err) => {
        if (!req.file) {
            return res.json({ error: 'Requires' });
        }
        if (err) {
            return res.status(500).send({ error: err.message })
        }
        const file = new file({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size

        })
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    })

});

router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required' })
    }

    const file = await File.findOne({ uuid: uuid })
    if (file.sender) {
        return res.status(422).send({ error: 'Already send' })
    }
    file.sender = emailFrom;
    file.reciever = emailTo;
    const response = await file.save();

    const sendMail = require('.services/emailService');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'File sharing',
        text: `${emailFrom} shared a file`,
        html: require('./services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env / APP_BASE_URL}/files/${fle.uuid}`,
            size: parseInt(file.size / 1000) + 'KB',
            expires: '24 hours'
        })
    })

    return res.send({ sucess: "sent" });

})
module.exports = router;