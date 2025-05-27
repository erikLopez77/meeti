const Usuarios=require('../models/Usuarios');
exports.formCrearCuenta=(req, res) => {
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta'
    });
}
exports.crearNuevaCuenta = async (req,res)=>{
    // Extraer solo los datos necesarios
    const usuario = req.body;
    console.log(req.body,'+++')
    try {
        // Crear el usuario con los campos definidos en el modelo
        const nuevoUsuario = await Usuarios.create(usuario);

        console.log('Usuario creado: ', nuevoUsuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
    }
}