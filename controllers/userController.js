const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sequelize = require('../config/database');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require("nodemailer");

//USER REGISTER
exports.register = async (req, res) => {
  console.log(req.body);
  const { userType, name, email, cpf, telefone, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm || !userType) {
    return res.render("register", {
      message: "Por favor preencha todos os campos",
    });
  }
  
  // Verifica se o email fornecido é válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render("register", {
      message: "Por favor insira um email válido",
    });
  }

  try {
    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      return res.render("register", {
        message: "Este email já está em uso",
      });
    }

    if (password !== passwordConfirm) {
      return res.render("register", {
        message: "As senhas não são iguais",
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    const newUser = User.build({
      userType: userType,
      name: name,
      email: email,
      cpf: cpf,
      telefone: telefone,
      password: hashedPassword,
     
    });

    await newUser.save();

    return res.render("register", {
      message: "Usuário cadastrado com sucesso",
    });

  } catch (error) {
    console.log(error);
    return res.render("register", {
      message: "Algo deu errado, por favor tente novamente.",
    });
  }
};

///LOGIN
exports.login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", {
      message: "Por favor, preencha todos os campos",
    });
  }
  
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.render("login", {
        message: "Email ou senha incorretos",
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.render("login", {
        message: "Email ou senha incorretos",
      });
    }

    const expiresIn = 30 * 24 * 60 * 60 * 1000;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    res.cookie("jwt", token, { httpOnly: true, maxAge: expiresIn });

    if (user.userType === 'cliente') {
      return res.render("clientPanel", {
      });
    } else if (user.userType === 'admin') {
      return res.redirect('/adminPanel');
    } else {
      return res.render("login", {
        message: "Tipo de usuário inválido",
      });
    }

  } catch (error) {
    console.log(error);
    return res.render("login", {
      message: "Algo deu errado, por favor tente novamente.",
    });
  }
};


// recuperar senha 
exports.changePassword = async (req, res) => {
  console.log(req.body);
  const { name, cpf, telefone, email } = req.body;

  if (!name || !cpf || !telefone || !email) {
    return res.render("changePassword", {
      title: 'Recuperar senha',
      message: "Por favor preencha todos os campos",
    });
  }

  // Verifica se o email fornecido é válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render("changePassword", {
      title: 'Recuperar senha',
      message: "Por favor insira um email válido",
    });
  }

  try {
    const userExists = await User.findOne({ where: { email: email } });

    if (!userExists) {
      return res.render("changePassword", {
        title: 'Recuperar senha',
        message: "Usuário não encontrado",
      });
    }

    if (userExists.name !== name || userExists.cpf !== cpf || userExists.telefone !== telefone) {
      return res.render("changePassword", {
        title: 'Recuperar senha',
        message: "Dados incorretos",
      });
    } 

    // manda email com a nova senha 

    const newPassword = Math.random().toString(15).slice(-8);
    console.log(newPassword);
    let hashedPassword = await bcrypt.hash(newPassword, 8);

    const user = await User.update({ password: hashedPassword }, { where: { email: email } });

    const message = `
      <h1>Olá ${userExists.name}!</h1>
      <p>Recebemos uma solicitação de alteração de senha para sua conta.</p>
      <p>Sua nova senha é: ${newPassword}</p>
      <p>Por favor, faça login com sua nova senha e altere-a para uma de sua preferência.</p>
      <p>Atenciosamente, equipe do Sistema de Modulo de Logistica.</p>
    `;
    try {
      let info = await sendEmail({
        email: userExists.email,
        subject: 'Alteração de senha',
        html: message
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return res.render("changePassword", {
        title: 'Recuperar senha',
        message: "Email enviado com sucesso",
      });
    } catch (error) {
      console.log(error);
      return res.render("changePassword", {
        title: 'Recuperar senha',
        message: "Algo deu errado, por favor tente novamente.",
      });
    }

  } catch (error) {
    console.log(error);
    return res.render("changePassword", {
      title: 'Recuperar senha',
      message: "Algo deu errado, por favor tente novamente.",
    });
  }
};