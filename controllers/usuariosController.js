const Usuarios = require('../models/Usuarios');
const { check, validationResult } = require('express-validator');
const enviarEmail = require('../handlers/emails');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    });
}
exports.crearNuevaCuenta = async (req, res) => {
    // Extraer solo los datos necesarios
    const usuario = req.body;
    await check('repetir').notEmpty().withMessage('El password confirmado no puede ir vacio').run(req);
    await check('repetir').equals(req.body.password).withMessage('El password es diferente').run(req);
    //leer los errores de express
    const erroresExpress = validationResult(req);
    try {
        // Crear el usuario con los campos definidos en el modelo
        await Usuarios.create(usuario);
        //url de confirmacion
        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;
        //enviar email de confirmacion
        await enviarEmail.enviarEmail({
            usuario,
            url,
            subject: 'Confirma tu cuenta de meeti',
            archivo: 'confirmar-cuenta'
        });
        req.flash('exito', 'Hemos enviado un e-mail, confirma tu cuenta');
        res.redirect('/iniciar-sesion')
    } catch (error) {
        // extraer el message de los errores
        console.log(error);
        let listaErrores = [];
        const erroresSequelize = error.errors ? error.errors.map(err => err.message) : [];
        //extraer msg de los errores
        const errExp = erroresExpress.errors.map(err => err.msg);
        //unir errores
        listaErrores = [...erroresSequelize, ...errExp];
        if (error.name === 'SequelizeUniqueConstraintError') {
            listaErrores.push('El correo electrónico ya está registrado');
        }

        if (listaErrores.length > 0) {
            req.flash('error', listaErrores);
        }
        res.redirect('/crear-cuenta');
    }
}
//confirma la suscripcion del usuario
exports.confirmarCuenta = async (req, res, next) => {
    //verificar que existe el usuario
    const usuario = await Usuarios.findOne({ where: { email: req.params.correo } });

    //si no existe el usuario se redirecciona
    if (!usuario) {
        req.flash('error', 'El usuario no existe');
        res.redirect('/crear-cuenta');
        return next();
    }
    usuario.activo = 1;
    await usuario.save();

    req.flash('exito', 'La cuenta se ha confirmado, ya puedes iniciar sesión');
    res.redirect('/iniciar-sesion');
}
//formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesión'
    });
}