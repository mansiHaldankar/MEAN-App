const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

const postRoutes = require('./routers/posts');
const userRoutes = require('./routers/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
// app.use((req, res, next) => {
//     //res.set
//     console.log("inside CORS");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.header(
//         "Access-Control-Allow-Methods",
//         "GET, POST, PATCH, DELETE, OPTIONS"
//     );
//     next();
// });

mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://admin:" + process.env.MONGO_DB_PW + "@mean-app.xgsw9.mongodb.net/MEAN-App", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(() => {
        console.log("Conncetion Failed");
    });

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

module.exports = app;