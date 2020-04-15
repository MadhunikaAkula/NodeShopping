const express = require('express');
const bodyParser = require('body-parser');
const path=require('path');

const app = express();

app.set('view engine','pug');//configuring pug to express
app.set('views','views')//to know express aboout our views

app.use(bodyParser.urlencoded({ extended: true }));

//serving files statically
app.use(express.static(path.join(__dirname,'public')));


const adminData=require('./routes/admin');
const shoproutes=require('./routes/shop');

//want to make our routes as per our url..
app.use('/admin',adminData.routes);
app.use(shoproutes);

app.use((req,res,next)=>{
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    res.render('404',{pageTitle:'Page not found'}) //server side rendering html files.
});

app.listen(3300, () => {
    console.log("server created");
});
