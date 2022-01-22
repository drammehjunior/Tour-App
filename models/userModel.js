const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AppError = require("../utils/appError");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "a user module must have a name"]
    },
    email: {
        type: String,
        required: [true, "a user module must have an email address"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'admin'
    },
    password: {
        type: String,
        required: [true, "A user module must have a password"],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "A user module must confirm the password"],
        // This only works on SAVE
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false 
    }
});

userSchema.pre('save', async function(next){
    //only run this function when password was actually modified
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12).catch((err) => {
        if(err){ 
            next(new AppError('There is an error', 500));
        };
    });
    

    //delete password confirm because i dont want this to be showing in the database
    this.confirmPassword = undefined;
    next();
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next){
    //this point to the current query
    this.find({active: {$ne: false}});
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        //console.log(changedTimestamp, JWTTimestamp);

        return JWTTimestamp < changedTimestamp;  
    }

    //false means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //console.log({resetToken}, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken; 
};

const User = mongoose.model('User', userSchema);

module.exports = User;