const {model, Schema } = require('mongoose');

const userSchema = new Schema({
    name:String,
    email:String,
    password:String,
    roles:[String],
    accountStatus:String,
})

export const User = model('User', userSchema);