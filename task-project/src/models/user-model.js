const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('../models/task-model');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!');
            }
        }
    },
    password:{
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Password can't contain 'password'!");
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            require: true
        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps: {createdAt: 'insert_date', updatedAt: 'update_date'}
});

userSchema.virtual('tasks', {
    ref: 'task',
    localField:'_id',
    foreignField: 'owner'
});

// Instance methed
userSchema.methods.toJSON = function(){

    const user = this;
    const userObject = user.toObject();

    delete userObject.token;
    delete userObject.password;
    delete userObject.avatar;
    delete userObject.insert_date;
    delete userObject.update_date;

    return userObject;
}

userSchema.methods.genrateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({
        "_id": user._id.toString()
    }, "thisissecret");

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}
// Model methed
userSchema.statics.findByCredentials= async (email, password)=>{
    const user = await User.findOne({email});

    if(!user){
        throw Error('Unable to Login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        return user;
    }else{
        throw Error('Unable to Login!');
    }
}


// Middleware hsah password
userSchema.pre('save', async function(next){
    const user = this;
    console.log('User Saving Middleware');

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next){
    const user = this;
    Task.deleteMany({ owner: user._id});

    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;