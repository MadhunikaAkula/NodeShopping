const express = require('express');

const app = express();

app.use('/add',(req, res, next) => {
    console.log("second middleware");
    res.send("<h1>Express with add product</h1>")      // res.send will automatically set the header text/html
});

app.use('/', (req, res, next) => {
    console.log("first middleware");
    res.send("<h1>Express with no route</h1>")         
    // next();                                         //next will allow to work with another middleware
});

// const server = http.createServer(app);

app.listen(3000, () => {
    console.log("server created")
});