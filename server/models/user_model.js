const mongoose = require("mongoose");
const Schema = mongoose.Schema

const UeserSchema = new Schema({
    username: {
        type: String
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        require: true,
        minlength: 6
    }
})

module.exports = User = mongoose.model('authenication', UeserSchema);