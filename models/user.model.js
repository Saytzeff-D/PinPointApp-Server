const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    business_name: String,
    business_addr: String,
    fname: String,
    lname: String,
    username: String,
    dob: String,
    state: String,
    city: String,
    email: String,
    password: String,
    type: String
})

const UserModel = mongoose.model('user_tbs', UserSchema)
module.exports  = UserModel