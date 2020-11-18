const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    creatorID: { type: mongoose.Schema.Types.ObjectId, ref: 'USer', required: true }
});

module.exports = mongoose.model('Post', postSchema);