const http = require('http');

const postcommentHandler = {};

postcommentHandler.getAllPostComments = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // Ambil data postingan
    http.get('http://jsonplaceholder.typicode.com/posts', (postResponse) => {
        let postData = '';

        postResponse.on('data', (chunk) => {
            postData += chunk;
        });

        postResponse.on('end', () => {
            // Ambil data komentar
            http.get('http://jsonplaceholder.typicode.com/comments', (commentResponse) => {
                let commentData = '';

                commentResponse.on('data', (chunk) => {
                    commentData += chunk;
                });

                commentResponse.on('end', () => {
                    try {
                        const posts = JSON.parse(postData);
                        const comments = JSON.parse(commentData);

                        const combinedData = posts.map((post) => {
                            const matchingComments = comments.filter((comment) => comment.postId === post.id);
                            return {
                                ...post,
                                comments: matchingComments,
                            };
                        });

                        res.end(JSON.stringify(combinedData));
                    } catch (error) {
                        console.error(error);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    }
                });

                commentResponse.on('error', (error) => {
                    console.error(error);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                });
            });
        });

        postResponse.on('error', (error) => {
            console.error(error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        });
    });
};

module.exports = postcommentHandler;
