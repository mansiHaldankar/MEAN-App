const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const Post = require('./models/post');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

mongoose.connect("mongodb+srv://admin:admin@mean-app.xgsw9.mongodb.net/MEAN-App", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(() => {
        console.log("Conncetion Failed");
    });

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully'
    });
});

app.get("/api/posts", (req, res, next) => {
    const posts = [{
            id: "fadf12421l",
            title: "First server-side post",
            content: "This is coming from the server"
        },
        {
            id: "ksajflaj132",
            title: "Second server-side post",
            content: "This is coming from the server!"
        }
    ];
    res.status(200).json({
        message: "Posts fetched successfully!",
        posts: posts
    });
});

module.exports = app;