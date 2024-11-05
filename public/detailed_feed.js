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
                    listItem.textContent = `${post.content} - ${new Date(post.createdAt).toLocaleString()}`;
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