const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
const transporter = nodemailer.createTransport(sgTransport({
  // service: 'gmail',
  auth: {
    api_key: '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'
    // user: 'madhunikaakula30@gmail.com',
    // pass: 'madhu@301'
  }

}));
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    validationErrors: [],
    oldMessage: {
      email: '',
      password: '',
    },
  });
};
exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldMessage: {
      username:'',
      email: '',
      password: '',
      confirmpassword: ''
    },
    validationErrors: []
  });
};
exports.postSignup = (req, res, next) => {
  const role="user"
  const username=req.body.username;
  const companyname='user';
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  const errors = validationResult(req);
  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: "please select capcha",
      oldMessage: {
        role:'user',
        username:username,
        companyname:'user',
        email: email,
        password: password,
        confirmpassword: confirmpassword
      },
      validationErrors: []
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldMessage: {
        role:'user',
        username:username,
        companyname:'user',
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
          role:'user',
          username:username,
          companyname:'user',
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
      return user.save();
    }).then((result) => {
      res.redirect('/login');
      // const mailOptions = {
      //   from: 'madhunikaakula30@gmail.com',
      //   to: 'anudeep.akula15@gmail.com',
      //   subject: 'hello hi',
      //   html: '<h1>successfully signedup madhunika</h1>'
      // };
      return transporter.sendMail({
        from: 'testworkonetwo@gmail.com',
        to: email,
        subject: 'WELcome to shoopping cart',
        html: '<h1>WELcome to shoopping cart</h1>'
      })
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldMessage: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'invalid mail and password',
          oldMessage: {
            email: email,
            password: password,
          },
          validationErrors: [],

        });
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.islogged = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'invalid mail and password',
            oldMessage: {
              email: email,
              password: password,
            },
            validationErrors: [],

          });
        })
        .catch(err => {
          res.redirect('/login')
          console.log(err)
        })
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    const email = req.body.email;
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash('error', "Account not found");
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail(
          {
            from: 'testworkonetwo@gmail.com',
            to: req.body.email,
            subject: 'Password Reset',
            html: `
          <p>You have requested for reset password</p>
          <p>Click this link <a href="http://localhost:3000/reset/${token}">Link</a></p>
          `
          }
        )
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  })

}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        resetpasswordToken: token
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
exports.postUpdatePassword = (req, res, next) => {
  const newpassword = req.body.newpassword;
  const passwordToken = req.body.resetpasswordToken;
  const userId = req.body.userId;
  let resetUser;
  User.findOne(
    {
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newpassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}