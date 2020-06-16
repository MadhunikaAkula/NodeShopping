const Categeory = require('../models/categeory');
const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

exports.getConfiguration = (req, res, next) => {
  res.render('config/configuration', {
    path: '/config/configuration',
    pageTitle: 'config',
  })
}
exports.getCategeory = (req, res, next) => {
  Categeory.find()
    .then(cats => {
      res.render('config/categeory', {
        cats: cats,
        path: '/config/categeory',
        pageTitle: 'categeory',
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getAddCategeory = (req, res, next) => {
  res.render('config/addCategeory', {
    path: '/config/addCategeory',
    pageTitle: 'categeory',
    editing:false

  })
}


exports.postAddCategeory = (req, res, next) => {
  const name = req.body.name;
  const orders = req.body.orders;
  const active = req.body.active;
  const categeory = new Categeory({
    name: name,
    orders: orders,
    active: active,
  });
  categeory
    .save()
    .then(result => {
      res.redirect('/config/categeory');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getEditCategeory = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const catId = req.params.catId;
  Categeory.findById(catId)
    .then(cat => {
      if (!cat) {
        return res.redirect('/');
      }
      res.render('config/Addcategeory', {
        pageTitle: 'Editcategeory',
        path: '/config/Editcategeory',
        editing: editMode,
        cat: cat
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postEditCategeory = (req, res, next) => {
  const catId = req.body.catId;
  const updatedname = req.body.name;
  const updatedorders = req.body.orders;
  const updatedactive = req.body.active;
  Categeory.findById(catId)
    .then(cat => {
      cat.name = updatedname;
      cat.orders = updatedorders;
      cat.active = updatedactive;
      return cat.save()
        .then(result => {
          console.log('UPDATED cat!');
          res.redirect('/config/categeory');
        })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAdmin = (req, res, next) => {
  User.find({role:'admin'}).then(admins=>{
    console.log("admins",admins)
    res.render('config/createdAdmins', {
      path: '/config/admin',
      pageTitle: 'categeory',
      admins:admins,
      editing:false
  
    })
  })
}


exports.getaddAdmin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('config/addAdmin', {
    path: '/config/admin',
    pageTitle: 'addAdmin',
    errorMessage: message,
    oldMessage: {
      role:'',
      username:'',
      companyname:'',
      email: '',
      password: '',
      confirmpassword: ''
    },
    validationErrors: []
  });
};
exports.postaddAdmin = (req, res, next) => {
  const role=req.body.role;
  const username=req.body.username;
  const companyname=req.body.companyname;
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("coming here")
    return res.status(422).render('config/addAdmin', {
      path: '/config/admin',
      pageTitle: 'addAdmin',
      errorMessage: errors.array()[0].msg,
      oldMessage: {
        role:role,
        username:username,
        companyname:companyname,
        email: email,
        password: password,
        confirmpassword: confirmpassword
      },
      validationErrors: errors.array()
    });
  }
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User(
        {
          role:role,
          username:username,
          companyname:companyname,
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
      return user.save();
    }).then((result) => {
      res.redirect('/config/admin');
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
