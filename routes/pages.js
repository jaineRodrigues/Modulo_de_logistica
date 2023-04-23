const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
})


router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/clientPanel', (req, res) => {
    res.render('clientPanel');
})


router.get('/adminPanel', (req, res) => {
    res.render('adminPanel');
})

module.exports = router;