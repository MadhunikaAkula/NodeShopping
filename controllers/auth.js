const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const mandrillTransport = require('nodemailer-mandrill-transport');
const transporter = nodemailer.createTransport({
  // host: 'smtp.mailtrap.io',
  service: 'gmail',
  // port: 3300,
  auth: {
    user: 'madhunikaakula30@gmail.com',
    pass: 'madhu@301'
    // api_key: '7d92740c7cdbef01709f1450a60fb2ed-us18'
  }
});
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
    errorMessage: message
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
    errorMessage: message

  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', "E-mail is already exists");
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User(
            {
              email: email,
              password: hashedPassword,
              cart: { items: [] }
            });
          return user.save();
        })
        .then((result) => {
          res.redirect('/login');
          // const mailOptions = {
          //   from: 'madhunikaakula30@gmail.com',
          //   to: 'anudeep.akula15@gmail.com',
          //   subject: 'hello hi',
          //   html: '<h1>successfully signedup madhunika</h1>'
          // };
          return transporter.sendMail({
            from: 'sender@example.com',
            to: email,
            subject: 'You have registered to Shopping Cart',
            html: '<h1>successfully signedup Congratulations</h1>'
          })
        }).catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', "invalid mail or password");
        return res.redirect('/login')
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
          req.flash('error', "invalid mail or password");
          res.redirect('/login')
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
            from: 'madhunikaakula30@gmail.com',
            to: req.body.email,
            subject: 'Password Reset',
            html: `
          <p>You have requested for reset password</p>
          <p>Click this link <a href="http://localhost:3000/reset/${token}">Link</a></p>
          `
          }
        )
      })
      .catch(err => console.log(err));
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
      console.log(err);
    })

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
      console.log("coming to pwd")
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    })
}