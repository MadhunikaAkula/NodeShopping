const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


const adminroutes=require('./routes/admin');
const shoproutes=require('./routes/shop');


app.use('/admin',adminroutes);
app.use(shoproutes);

app.use((req,res,next)=>{
    res.status(404).send("<h1>page not found</h1>");
});

app.listen(3300, () => {
    console.log("server created");
});
