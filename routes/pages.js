const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

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

router.get('/cadveiculos', (req, res) => {
    res.render('cadveiculos');
})

router.get('/cadcondutores', (req, res) => {
    res.render('cadcondutores');
})

router.get('/personalData', authMiddleware, (req, res) => {
    res.render('personalData', { 
      name: res.locals.user.name, 
      email: res.locals.user.email 
    });
  });
  



module.exports = router;