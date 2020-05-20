const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-Auth');

const { check,body } = require('express-validator');


const router = express.Router();

// /admin/add-product => GET
router.get('/add-product',
    isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body('title').isString().isLength({ min: 5 }).trim(),
    body('imageUrl').isURL(),
    body('price').isDecimal(),
    body('description').isAlphanumeric().isLength({ min: 5, max: 2000 }).trim()
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth,
    [
        body('title').isString().isLength({ min: 5 }).trim(),
        body('imageUrl').isURL(),
        body('price').isDecimal(),
        body('description').isAlphanumeric().isLength({ min: 5, max: 2000 }).trim()
    ], adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
