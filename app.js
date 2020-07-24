const { findSourceMap } = require('module');

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/blog', function (req, res) {
    res.render('blog');
});

app.listen(port, () => {
    console.log('Server started at localhost:' + port);
});