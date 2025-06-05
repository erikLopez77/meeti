const passport = require("passport");

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});
exports.usuarioAutenticado =(req,res,next) =>{
    //si el usuario esta autenticado
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/iniciar-sesion');
}