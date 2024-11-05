require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Post = require('./models/post');

const app = express();
const PORT = 3000;

// Middleware to parse form data
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

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home_page.html'));
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

app.get('/newPostButton', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'new_post.html'));
});

app.get('/detailedFeed', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detailed_blog.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home_page.html'));
});

app.post('/submitPost', async (req, res) => {
    console.log('req.body:', req.body);
    const postContent = req.body.content;

    // Create a new Post instance
    const newPost = new Post({
        content: postContent
    });
    // Save the new post
    try {
        await newPost.save();
        console.log('New post saved:', newPost);
        res.redirect('/');
    } catch (error) {
        console.error('Error saving new post:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/logout', (req, res) => {
    // Clear the session data
    res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
