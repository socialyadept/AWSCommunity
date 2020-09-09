const { findSourceMap } = require('module');
const { toUnicode } = require('punycode');
const blogs = require('./models/blogs');

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Blogs = require('./models/blogs'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    User = require('./models/user'),
    TempBlog = require('./models/tempBlog'),
    port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/aws_blogs', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(require('express-session')({
    secret: "Once again We won",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //for local check of authentication
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//for rendering some current data to all local res requests
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

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
    console.log(newBlog);

    newBlog.date = dateTime;

    TempBlog.create(newBlog, function (err, blog) {
        if (err)
            console.log(err);
        else {
            console.log(blog);
            res.render("approval");
        }
    });
});

app.post('/blog/confirmnew', isLoggedIn, (req, res) => {

    TempBlog.findById(req.body.id, function (err, temp) {
        if (err) {
            console.log('error');


        } else {
            console.log('temp blog: \n')
            console.log(temp);

            var title = temp.title,
                author = temp.author,
                tags = temp.tags,
                image = temp.image,
                description = temp.description,
                quote = temp.quote,
                text = temp.text,
                date = temp.date;
            Blogs.create({ title, author, tags, image, description, quote, text, date }, function (err, blog) {
                if (err)
                    console.log(err);
                else {
                    console.log('rendered blog')
                    console.log(blog);
                    Blogs.find(function (err, allblogs) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            TempBlog.findByIdAndDelete(req.body.id, function (err, deletedItem) {
                                if (err) {
                                    console.log('deleted error\n' + err);
                                }
                                else {
                                    console.log('successfully deleted \n' + deletedItem);
                                    res.render("blog/show", { blog: blog, allblogs: allblogs });

                                }
                            });
                        }

                    });
                }
            });
        }

    });

});

app.post('/blog/rejectnew', isLoggedIn, (req, res) => {

    TempBlog.findByIdAndDelete(req.body.id, function (err, deletedItem) {
        if (err) {
            console.log('deleted error\n' + err);
        }
        else {
            console.log('successfully deleted \n' + deletedItem);
            res.redirect("/dashboard");
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

app.get('/tempBlog/:id', (req, res) => {

    TempBlog.findById(req.params.id)
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

app.get('/faqs', (req, res) => {

    res.render('faqs');

});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    var newUser = new User({ username: req.body.username, email: req.body.email });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function () { //for loggin in user
            res.redirect('/');
        });
    });
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), (req, res) => {

});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
}, function (req, res) {

});

app.get('/dashboard', isLoggedIn, (req, res) => {
    TempBlog.find({}, (err, allblogs) => {
        if (err)
            console.log(err);

        else {
            TempBlog.countDocuments({}, function (err, count) {
                if (err)
                    console.log(err);
                else {
                    //count = Math.floor((Math.random() * count) + 1)
                    //console.log("total number of models: " + count);
                    res.render('dashboard', { blogs: allblogs, count: count });

                }
            });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // currentUser = true;
        return next();
    }
    res.redirect('/login');
}

app.get('*', (req, res) => {
    res.render('error');
});

app.listen(port, () => {
    console.log('Server started at localhost:' + port);
});