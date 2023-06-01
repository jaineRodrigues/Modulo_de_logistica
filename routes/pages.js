const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { listVehicles } = require('../middlewares/listVehicles');
const { listCenters } = require('../middlewares/centerMiddleware');

router.get('/', (req, res) => {
    res.render('index', { title: 'Página Inicial' });
})

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registrar' });
})

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
})

router.get('/clientPanel', authMiddleware, (req, res) => {
    res.render('clientPanel', {
        title: 'Painel do Cliente',
        name: res.locals.user.name,
        email: res.locals.user.email,
        telefone: res.locals.user.telefone,
        cpf: res.locals.user.cpf
    });
})

router.get('/adminPanel', authMiddleware, (req, res) => {
    res.render('adminPanel', {
        title: 'Painel do Administrador',
        name: res.locals.user.name,
    });
})

router.get('/cadveiculos', authMiddleware, (req, res) => {
    res.render('cadveiculos', {
        title: 'Cadastrar Veículos',
    });
})

router.get('/cadcondutores', authMiddleware, (req, res) => {
    res.render('cadcondutores', { title: 'Cadastrar Condutores' });
})

router.get('/cadtransportadora', authMiddleware, (req, res) => {
    res.render('cadtransportadora', { title: 'Cadastrar Transportadora' });
})

router.get('/personalData', authMiddleware, (req, res) => {
    res.render('personalData', {
        title: 'Dados Pessoais',
        name: res.locals.user.name,
        email: res.locals.user.email,
        telefone: res.locals.user.telefone,
        cpf: res.locals.user.cpf
    });
});

router.get('/changePassword', (req, res) => {
    res.render('changePassword', { title: 'Recuperar senha' });
})

router.get('/serviceRegistration', listVehicles, (req, res) => {
    res.render('serviceRegistration', {
        title: 'Registro de Serviços',
        vehicles: res.locals.vehicles,
    });
});

router.get('/logout', authMiddleware, (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/login");
})

router.get('/centerRegistration', (req, res) => {
    res.render('centerRegistration', {
        title: 'Registro de Centros de Distribuição',
    });
});

router.get('/distribuitionCenter', (req, res) => {
    res.render('distribuitionCenter', {
        title: 'Centros de Distribuição',
    });
});

router.get('/editCenter/:id/edit', listCenters, (req, res) => {
    res.render('editCenter', {
        title: 'Editar Centros de Distribuição',
        id: req.params.id,
        centers: res.locals.centers,
    });
});

router.get('/centerList', listCenters, (req, res) => {
    res.render('centerList', {
        title: 'Listar Centros de Distribuição',
        centers: res.locals.centers,
    });
});

module.exports = router;