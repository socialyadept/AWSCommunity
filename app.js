const { findSourceMap } = require('module');
const { toUnicode } = require('punycode');
const blogs = require('./models/blogs');

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Blogs = require('./models/blogs'),
    port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/aws_blogs', { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/blog', function (req, res) {
    Blogs.find({}, (err, allblogs) => {
        if (err)
            console.log(err);

        else {
            Blogs.countDocuments({}, function (err, count) {
                if (err)
                    console.log(err);
                else {
                    //count = Math.floor((Math.random() * count) + 1)
                    //console.log("total number of models: " + count);
                    res.render('blog/index', { blogs: allblogs, count: count });

                }
            });
        }
    });
});

app.get('/blog/:id', (req, res) => {
    var id = req.params.id;

    Blogs.findById(id, function (err, blog) {
        if (err)
            console.log(err);
        else {
            console.log(blog);
            Blogs.find({}, (err, allblogs) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('blog/show', { blog: blog, allblogs: allblogs })
                }
            })

        }
    });
});

app.get('/blog/new', (req, res) => {
    res.render('blog/new');
});

app.post('/blog/new', (req, res) => {
    var newBlog = req.body;

    Blogs.create(newBlog, function (err, blog) {
        if (err)
            console.log(err);
        else {
            console.log(newBlog);
            res.redirect('/blog/new');
        }
    });
});

app.post('/newsletter', function (req, res) {
    var email = req.body;
    var email_g = req.params;
    console.log(email);
});

app.listen(port, () => {
    console.log('Server started at localhost:' + port);
});