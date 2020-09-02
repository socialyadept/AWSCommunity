var mongoose = require('mongoose');

var tempSchema = new mongoose.Schema({
    title: String,
    author: String,
    tags: [String],
    image: String,
    description: String,
    quote: String,
    text: String,
    date: String

});

module.exports = mongoose.model("TempBlog", tempSchema);