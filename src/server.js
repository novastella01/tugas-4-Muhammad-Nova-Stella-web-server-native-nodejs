const http = require('http');
const url = require('url');

const boot = () => {
    const init = http.createServer(async(req, res) => {
        res.setHeader('Content-Type', 'application/json'); 

        if (req.url === '/api/comment/get') {
            try {
                const data = await fetchData('http://jsonplaceholder.typicode.com/comments');
                const formattedData = formatCommentData(data);
                res.end(JSON.stringify(formattedData));
            } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        } else if (req.url === '/api/post/get') {
            try {
                const data = await fetchData('http://jsonplaceholder.typicode.com/posts');
                const formattedData = formatPostData(data);
                res.end(JSON.stringify(formattedData)); 
            } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        } else if (req.url === '/api/post-comment/get') {
            try {
                const postData = await fetchData('http://jsonplaceholder.typicode.com/posts');
                const commentData = await fetchData('http://jsonplaceholder.typicode.com/comments');

                const formattedPostData = formatPostData(postData);
                const formattedCommentData = formatCommentData(commentData);

                const combinedData = combineData(formattedPostData, formattedCommentData);

                res.end(JSON.stringify(combinedData));
            } catch (error) {
                console.error(error); 
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    });

    const fetchData = (apiUrl) => {
        return new Promise((resolve, reject) => {
            const protocol = apiUrl.startsWith('http') ? http : http;
            protocol.get(apiUrl, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData);
                    } catch (error) {
                        reject(error);
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    };

    const formatPostData = (postData) => {
        return postData.map((item) => ({
            userId: item.userId,
            'post id': item.id,
            judulPost: item.title,
            content: item.body,
        }));
    };

    const formatCommentData = (commentData) => {
        return commentData.map((comment) => ({
            "postId": comment.postId,
            "name": comment.name,
            "email": comment.email,
            "content": comment.body
        }));
    };

    const combineData = (posts, comments) => {
        const combinedData = posts.map((post) => {
            const matchingComments = comments.filter((comment) => comment.postId === post['post id']);
            return {
                id: post['post id'],
                judulPost: post.judulPost,
                contentPost: post.content,
                comments: matchingComments.map(comment => ({
                    postid: comment.postId,
                    namaUser: comment.name,
                    emailUser: comment.email,
                    contentComment: comment.content
                }))
            };
        });

        return combinedData;
    };


    return init;
};

module.exports = boot;
