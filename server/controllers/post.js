const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 2;
        
        const totalItems = await Post.find().countDocuments()
        const posts = await Post.find().skip((currentPage - 1) * perPage).limit(perPage);
        res.status(200).json({
            message: 'Fetched posts successfully.',
            posts: posts,
            totalItems: totalItems
        });

    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    } 
    
};

exports.createPost = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        if (!req.file) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path;
        const {title , content} = req.body;
        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: { name: 'Yogendra Raj' }
        });
        const result = await post.save()
        res.status(201).json({
            message: 'Post created successfully!',
            post: result
        }); 
    } catch(error){
        next(error);
    }
};

exports.getPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Post fetched.', post: post });    
    } catch(error){
        next(error);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        const {title,content,image} = req.body.title;
        if (req.file) {
            imageUrl = req.file.path;
        }
        if (!imageUrl) {
            const error = new Error('No file picked.');
            error.statusCode = 422;
            throw error;
        }
        const post = await Post.findById(postId)
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        const result = await post.save();
        res.status(200).json({ message: 'Post updated!', post: result });
        
    } catch(error){
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId)
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        // Check logged in user
        clearImage(post.imageUrl);
        const result = await Post.findByIdAndRemove(postId);
    
        console.log(result);
        res.status(200).json({ message: 'Deleted post.' });
        
    } catch(error){
        next(error);
    }
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
