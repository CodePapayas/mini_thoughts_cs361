require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Post = require('./models/post');
const verifyToken = require('./middleware/jwt_validation');

const app = express();
const PORT = 3005;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Public Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing_page.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign_up.html'));
});

app.get('/detailedFeed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detailed_blog.html'));
});

app.get('/newPostButton', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'new_post.html'));
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Authentication Routes
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const response = await fetch(`${process.env.AUTH_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            res.redirect('/home_page.html'); // Redirect on successful login
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error communicating with the authentication service.' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const response = await fetch(`${process.env.AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            res.redirect('/home_page.html'); // Redirect on successful login
        } else {
            res.status(response.status).json(data);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error communicating with the authentication service.' });
    }
});

// Protected Routes
app.post('/submitPost', verifyToken, async (req, res) => {
    const postContent = req.body.content;

    const newPost = new Post({ content: postContent });

    try {
        await newPost.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error saving new post:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/like/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        post.likes += 1;
        await post.save();

        res.json({ likes: post.likes });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/logout', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
