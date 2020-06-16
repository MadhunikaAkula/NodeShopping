const path = require('path');

const express = require('express');

const User = require('../models/user');

const { check, body } = require('express-validator');


const configurationController = require('../controllers/configuration');

const isAuth = require('../middleware/is-Auth');

const router = express.Router();

router.get('/configuration', isAuth, configurationController.getConfiguration)

router.get('/categeory', isAuth, configurationController.getCategeory)

router.get('/addCategeory', isAuth, configurationController.getAddCategeory)

router.post('/addCategeory', isAuth, configurationController.postAddCategeory)

router.get('/Editcategeory/:catId', isAuth, configurationController.getEditCategeory)

router.post('/Editcategeory', isAuth, configurationController.postEditCategeory)

router.get('/admin', isAuth, configurationController.getAdmin)

router.get('/addAdmin', isAuth, configurationController.getaddAdmin);

router.post('/addAdmin',isAuth,
    [
        check('email')
            .isEmail()
            .withMessage("please enter valid email")
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then((userDoc) => {
                        if (userDoc) {
                            return Promise.reject("Email is already exists pick new one")
                        }
                    })
            }).normalizeEmail()
        ,
        body('password', "password should be atleast 5 numbers")
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmpassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("password should match");
                }
                return true
            }),
    ],
    configurationController.postaddAdmin);


module.exports = router;
