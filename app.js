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

app.get('/blog/new', (req, res) => {
    res.render('blog/new');
});

app.post('/blog/new', (req, res) => {
    var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
        time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
        dateTime = date + ' ' + time,
        newBlog = req.body;

    newBlog.date = dateTime;

    Blogs.create(newBlog, function (err, blog) {
        if (err)
            console.log(err);
        else {
            res.redirect("/blog/" + blog._id);
        }
    });
});

app.get('/blog/:id/edit', (req, res) => {

    try {
        Blogs.findById(req.params.id, function (err, blog) {
            if (err) {
                console.log(err);
                res.redirect('/*');
            }
            else {
                res.render('blog/edit', { blog: blog })
            }
        });
    }
    catch {
        res.redirect('/*');
    }

});

app.post('/blog/:id/edit', (req, res) => {
    var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
        time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
        dateTime = date + ' ' + time,
        updatedBlog = req.body;

    updatedBlog.date = dateTime;
    console.log(updatedBlog);

    Blogs.findByIdAndUpdate(req.params.id, updatedBlog, function (err, blog) {
        if (err)
            console.log(err);
        else {
            res.redirect('/blog/' + blog._id)
        }
    });
});

app.get('/blog/:id', (req, res) => {

    Blogs.findById(req.params.id)
        .then(blog => {
            Blogs.find({}, (err, allblogs) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('blog/show', { blog: blog, allblogs: allblogs })
                }
            });
        })
        .catch(err => {
            res.redirect('/error');
        });

});

app.get('*', (req, res) => {
    res.render('error');
});

app.listen(port, () => {
    console.log('Server started at localhost:' + port);
});