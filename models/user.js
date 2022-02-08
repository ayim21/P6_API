const mongoose = require('mongoose');
//This plugin adds a pre-save validation for unique fields within a mongoose schema
const uniqueValidator = require('mongoose-unique-validator');
//
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: [
            isEmail, 
            'Please fill in a valid email address'
        ],
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);