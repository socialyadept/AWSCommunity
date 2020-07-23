const { findSourceMap } = require('module');

var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log('Server started at localhost:' + port);
});