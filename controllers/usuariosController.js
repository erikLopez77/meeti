const Usuarios=require('../models/Usuarios');
const {check, validationResult} =require('express-validator');

exports.formCrearCuenta=(req, res) => {
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta'
    });
}
exports.crearNuevaCuenta = async (req,res)=>{
     // Extraer solo los datos necesarios
    const usuario = req.body;
    await check('repetir').notEmpty().withMessage('El password confirmado no puede ir vacio').run(req);
    await check('repetir').equals(req.body.password).withMessage('El password es diferente').run(req);
    //leer los errores de express
    const erroresExpress=validationResult(req);
    try {
        // Crear el usuario con los campos definidos en el modelo
        await Usuarios.create(usuario);
        req.flash('exito','Hemos enviado un e-mail, confirma tu cuenta');
        res.redirect('/iniciar-sesion')
    } catch (error) {
       // extraer el message de los errores
        let listaErrores = [];
        const erroresSequelize= error.errors.map(err=>err.message);
        //extraer msg de los errores
        const errExp=erroresExpress.errors.map(err=>err.msg);
        //unir errores
        listaErrores=[...erroresSequelize,...errExp];
        if (error.name === 'SequelizeUniqueConstraintError') {
            listaErrores.push('El correo electrónico ya está registrado');
        }
        req.flash('error',listaErrores);
        res.redirect('/crear-cuenta');
    }
}
//formulario para iniciar sesion
exports.formIniciarSesion= (req,res)=>{
    res.render('iniciar-sesion',{
        nombrePagina: 'Iniciar sesión'
    });
}