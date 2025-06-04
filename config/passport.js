const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuarios = require('../models/Usuarios');
const { pass } = require('./emails');
const emails = require('./emails');
const { where } = require('sequelize');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, next) => {
        //codigo se ejecuta al llenar el formulario
        const usuario = await Usuarios.findOne({ where: { email, activo: 1 } });

        //revisar si existe el usuario o no
        if (!usuario) return next(null, false, {
            message: 'El usuario no existe'
        });
        //comparar sus password 
        const verificarPassword = usuario.validarPassword(password);
        //si el password es incorrecto
        if (!verificarPassword) return next(null, false, {
            message: 'Password incorrecto'
        })

        return next(null, usuario);
    }
));

passport.serializeUser(function (usuario, cb) {
    cb(null, usuario);
});

passport.deserializeUser(function (usuario, cb) {
    cb(null, usuario);
});

module.exports = passport;