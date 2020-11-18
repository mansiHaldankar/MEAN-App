const Post = require("../models/post");

exports.createPosts = (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        creatorID: req.userData.creatorID
    });

    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: 'Post added successfully',
            post: createdPost
        });
    }).catch(error => {
        res.status(501).json({
            message: 'Error While Creating Post!!',
        });
    });
}

exports.updatePost = (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        creatorID: req.userData.creatorID
    });
    console.log(req.userData.creatorID);
    Post.updateOne({ _id: req.params.id, creatorID: req.userData.creatorID }, post)
        .then((result) => {
            if (result.n > 0) {
                res.status(200).json({
                    message: "Post Updated Successfully"
                });
            } else {
                res.status(401).json({
                    message: "Auth Failed"
                });
            }

        }).catch(error => {
            res.status(501).json({
                message: 'Error While Updating post!!',
            });
        });;
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize; // + : Convert string into int
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then(posts => {
        // postQuery.countDocuments()
        fetchedPosts = posts;
        return Post.countDocuments();
    }).then(count => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error => {
        res.status(501).json({
            message: 'Error While Fetching Posts!!',
        });
    });;
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json({ post });
        } else {
            res.status(404).json({
                message: "Post Not Found"
            });
        }
    }).catch(error => {
        res.status(501).json({
            message: 'Post Not Found!!',
        });
    });
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creatorID: req.userData.creatorID })
        .then((result) => {
            if (result.n > 0) {
                res.status(200).json({
                    message: "Post Updated Successfully"
                });
            } else {
                res.status(401).json({
                    message: "Auth Failed"
                });
            }
        }).catch(error => {
            res.status(501).json({
                message: 'Error While Creating Post!!',
            });
        });;
}