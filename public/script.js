// Load truncated post content and display it in a list
document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('postList');

    if (!postList) {
        console.error('Error: postList element not found.');
        return;
    }

    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            if (Array.isArray(posts) && posts.length > 0) {
                posts.forEach(post => {
                    const listItem = document.createElement('li');
                    const truncatedContent = post.content.length > 100 
                        ? post.content.substring(0, 100) + '...' 
                        : post.content;
                    listItem.textContent = `${truncatedContent} - ${new Date(post.createdAt).toLocaleString()}`;
                    postList.appendChild(listItem);
                });
            } else {
                postList.innerHTML = '<li>No posts available.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postList.innerHTML = '<li>Error loading posts.</li>';
        });
});

// Post a new blog post
document.addEventListener('DOMContentLoaded', () => {
    const cancelButton = document.getElementById('cancelButton');
    const newPostForm = document.getElementById('newPostForm');

    cancelButton.addEventListener('click', () => {
        const confirmation = confirm('Are you sure you want to cancel? Any unsaved changes will be lost.');
        if (confirmation) {
            window.location.href = '/';
        }
    });

    newPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const content = document.getElementById('postContent').value;

        if (content.trim() === '') {
            alert('Post content cannot be empty.');
            return;
        }

        try {
            const response = await fetch('/submitPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                alert('Post submitted successfully.');
                window.location.href = '/';
            } else {
                alert('Failed to submit the post.');
            }
        } catch (error) {
            console.error('Error submitting the post:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
