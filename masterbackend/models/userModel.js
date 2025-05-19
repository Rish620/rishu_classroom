const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: { required: true, type: String },
    email: { 
        required: true, 
        type: String, 
        unique: true // Ensuring the email is unique
    },
    password: { required: true, type: String },
    role: { 
        type: String, 
        enum: ['teacher', 'student'], // Role can only be 'teacher' or 'student'
        required: true 
    }
}, { timestamps: true });

userSchema.pre('save', async function (next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();

})

module.exports = mongoose.model('User', userSchema);
