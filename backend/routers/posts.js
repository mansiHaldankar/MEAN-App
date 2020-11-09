const express = require("express");

const multer = require("multer");

const router = express.Router();
const Post = require("../models/post");

const MIME_TYPE_MAP = {
    'images/png': 'png',
    'images/jpeg': 'jpg',
    'images/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "backeng/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

router.post("", multer({ storage: storage }).single('image'), (req, res, next) => {
    console.log(req);
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: 'Post added successfully',
            post: createdPost
        });
    });
});

router.get("", (req, res, next) => {
    Post.find().then(posts => {
        console.log(posts);
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: posts
        });
    });
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(() => {
            console.log("Post Deleted");
            res.status(200).json({
                message: "Post Deleted Successfully"
            });
        });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json({ post });
        } else {
            res.status(404).json({
                message: "Post Not Found"
            });
        }
    });
});

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post)
        .then(() => {
            res.status(200).json({
                message: "Post Updated Successfully"
            });
        });
})

module.exports = router;
