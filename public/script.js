document.addEventListener('DOMContentLoaded', () => {
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            const userConfirmed = confirm('WARNING! Cancelling now will remove all of your work. Are you sure you want to cancel?');
            if (userConfirmed) {
                window.location.href = '/';
            }
        });
    }

    const postList = document.getElementById('postList');

    if (!postList) {
        console.error('Error: postList element not found.');
        return;
    }

    // Fetch and display posts with truncated content and like buttons
    fetch('/api/posts')
        .then(response => response.json())
        .then(posts => {
            if (Array.isArray(posts) && posts.length > 0) {
                posts.forEach(post => {
                    const listItem = document.createElement('li');
                    const truncatedContent = post.content.length > 100 
                        ? post.content.substring(0, 100) + '...' 
                        : post.content;
                    
                    listItem.innerHTML = `
                        <p>${truncatedContent} - ${new Date(post.createdAt).toLocaleString()}</p>
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
