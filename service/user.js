
const UserModel = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
async function createUser(email, username, hashedPassword) {
    const user = new UserModel({
        email,
        username,
        hashedPassword,
    })

    await user.save();
    return user
}

async function getUserById(id) {
    const user = await UserModel.findById(id);
    return user;
}

async function getUserByEmail(email) {
    const pattern = new RegExp(`^${email}$`, 'i')
    const user = await UserModel.findOne({ email: { $regex: pattern } });

    return user;
}
async function login(email, password) {
    const existing = await getUserByEmail(email);
    if (!existing) {
        throw new Error('No such user!');
    }

    const hasMatch = await bcrypt.compare(password, existing.hashedPassword);

    if (!hasMatch) {
        throw new Error('Incorrect password!');
    }

    return generateToken(existing);
}



async function register(email, username, hashedPassword) {
    const existing = await getUserByEmail(email);

    if (existing) {
        throw new Error('Email is already existing.');
    }
    const pass = await bcrypt.hash(hashedPassword, 10);
    const user = await createUser(email, username, pass);
    return generateToken(user);
}

function generateToken(userData) {
    console.log(userData)
    const token = jwt.sign({
        _id: userData._id,
        email: userData.email
    }, 'simpleSecret');
    return token;
}

async function followUser(userToFollow, userId) {
    const user = await UserModel.findById(userToFollow);
    console.log(user.followers)
    if (user.followers.indexOf(userId) != -1) {
        throw new Error("You can not follow user that you have already follow!")
    }

    user.followers.push(userId)
    await user.save()
}
async function unFollowUser(userToUnFollow, userId) {
    const user = await UserModel.findById(userToUnFollow);
    if (user.followers.indexOf(userId) == -1) {
        throw new Error("You can not unfollow user that you do not follow!")
    }
    user.followers.splice(userId, 1)
    await user.save()
}

async function addToBookmarks(blogId, userId) {
    const user = await UserModel.findById(userId);
    if (user.bookmarks.indexOf(blogId) != -1) {
        throw new Error("You already has this blog in bookmarks!")
    }
    user.bookmarks.push(blogId)
    await user.save()
}
async function getBookmarks(userId) {
    const user = await UserModel.findById(userId).populate({
        'path': 'bookmarks',    
        populate: {'path': 'author', 'model': 'User'}
    }).lean();
    if (user.bookmarks.length < 1) {
        return []
    }
    return user.bookmarks;
}
async function removeFromBookmarks(blogId, userId) {
    const user = await UserModel.findById(userId);
    
    if (user.bookmarks.indexOf(blogId) == -1) {
        throw new Error('You do not have this blog in bookmarks!')
    }
    
    user.bookmarks.splice(user.bookmarks.indexOf(mongoose.Types.ObjectId(blogId)), 1);
    
    await user.save();


}
module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    login,
    register,
    generateToken,
    followUser,
    unFollowUser,
    addToBookmarks,
    getBookmarks,
    removeFromBookmarks
}