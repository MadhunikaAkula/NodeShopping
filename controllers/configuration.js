const Product = require('../models/product');
const Categeory = require('../models/categeory');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');

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

// exports.delCategeory = (req, res, next) => {
//   const catId = req.body.catId;
//   Categeory.deleteOne({ _id: catId, userId: req.user._id }).then(result => {
//     res.redirect('/config/categeory');
//   }).catch(err=> {
//     res.status(500).json({
//       "message": "deleted cat falied"
//     })
//   })
// }

