const commentHandler = {}

commentHandler.getAllComments = (req, res) => {
    res.writeHead(200, "OK")
    fetch('https://jsonplaceholder.typicode.com/comments')
        .then((response) => response.json())
        .then((json) => console.log(json));
}



module.exports = commentHandler;
