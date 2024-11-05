// Load the detailed post content and display it in a list
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
                    listItem.innerHTML = `
                        <p>${post.content} - ${new Date(post.createdAt).toLocaleString()}</p>
                        <button class="likeButton" data-id="${post._id}">Like (${post.likes})</button>
                    `;
                    postList.appendChild(listItem);
                });

                // Add event listeners for all like buttons
                document.querySelectorAll('.likeButton').forEach(button => {
                    button.addEventListener('click', async () => {
                        const postId = button.getAttribute('data-id');
                        try {
                            const response = await fetch(`/like/${postId}`, {
                                method: 'POST'
                            });
                            if (response.ok) {
                                const data = await response.json();
                                button.textContent = `Like (${data.likes})`;
                            }
                        } catch (error) {
                            console.error('Error liking post:', error);
                        }
                    });
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

// Like a specific post on a detailed view page
document.addEventListener('DOMContentLoaded', () => {
    const postId = window.location.pathname.split('/').pop();
    const likeButton = document.getElementById('likeButton');

    fetch(`/post/${postId}`)
        .then(response => response.json())
        .then(post => {
            document.getElementById('postContent').textContent = post.content;
            document.getElementById('postDate').textContent = `Posted on: ${new Date(post.createdAt).toLocaleString()}`;
            likeButton.textContent = `Like (${post.likes})`;

            likeButton.addEventListener('click', async () => {
                try {
                    const response = await fetch(`/like/${postId}`, {
                        method: 'POST'
                    });
                    if (response.ok) {
                        const data = await response.json();
                        likeButton.textContent = `Like (${data.likes})`;
                    }
                } catch (error) {
                    console.error('Error liking post:', error);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching post details:', error);
        });
});
