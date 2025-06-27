const express = require('express');
const app = express();
const port = 3012;
const todoRoutes = require('./todo');


app.use(express.json());


app.use('/todo', todoRoutes);


app.post('/signin', function(req, res) {
    res.json("signin route working");
});

app.post('/signup', function(req, res) {
    res.json("signup route working");
});


function auth(req, res, next) {

    console.log("Auth middleware triggered");
    next();
}


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});