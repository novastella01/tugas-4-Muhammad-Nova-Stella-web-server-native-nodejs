const postHandler = require("../handler/postHandler.js")
const commentHandler = require("../handler/commentHandler.js")
const postcommentHandler = require("../handler/postcommentHandler.js")



const router = {}
router.init = (req, res) => {

    if (req.url === "/api/post/get") {
        postHandler.getAllPost(req, res);
    }
    // silahkan tambahkan routing lain disini
    else if (req.url === "/api/comment/get") {
        commentHandler.getAllComments(req, res);
    } else if (req.url === "/api/post-comment/get") {
        postcommentHandler.getAllPostComments(req, res);
    } else {
        res.end("Not Found Route !")
    }
}
module.exports = router
