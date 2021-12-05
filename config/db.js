const mongoose = require('mongoose');
function connectDB() {
    mongoose.connect('mongodb://localhost:27017/fileShare');

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log("Database connected");
    });
}

module.exports = connectDB;