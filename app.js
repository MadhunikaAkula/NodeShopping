const express = require('express');
const bodyParser = require('body-parser');
const expressHbs=require('express-handlebars');
const path=require('path');

const app = express();
// app.engine('hbs',expressHbs({layoutsDir:'views/layouts/',defaultLayout:'main-layout',extname:'hbs'}));
// app.set('view engine','hbs');//configuring handlebars to express  
// app.set('view engine','pug'); 
 app.set('view engine','ejs');  
 app.set('views','views')//to know express about our views



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
