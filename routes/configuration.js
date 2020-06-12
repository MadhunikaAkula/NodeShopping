const path = require('path');

const express = require('express');

const configurationController = require('../controllers/configuration');

const isAuth=require('../middleware/is-Auth');

const router = express.Router();

router.get('/configuration',isAuth,configurationController.getConfiguration)

router.get('/categeory',isAuth,configurationController.getCategeory)

router.get('/addCategeory',isAuth,configurationController.getAddCategeory)

router.post('/addCategeory',isAuth,configurationController.postAddCategeory)

router.get('/Editcategeory/:catId',isAuth,configurationController.getEditCategeory)

router.post('/Editcategeory',isAuth,configurationController.postEditCategeory)

// router.delete('/delCategeory/:catId',isAuth,configurationController.delCategeory)


module.exports = router;
