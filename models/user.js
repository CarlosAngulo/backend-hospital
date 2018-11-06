var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not an allowed value'
};

var userSchema = new Schema({
    name: { type: String, required: [true, 'User name is required'] },
    email: { type: String, unique: true, required: [true, 'E-mail is required'] },
    password: { type: String, required: [true, 'Password name is required'] },
    img: { type: String },
    role: { 
        type: String, 
        default:'USER_ROLE', 
        required: [true, 'Role name is required'], 
        enum: validRoles
    },
});

userSchema.plugin( uniqueValidator, {message: '{PATH} is already in use'} )

module.exports = mongoose.model('Users', userSchema); 