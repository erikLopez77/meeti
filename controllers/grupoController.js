const Categorias = require('../models/Categoria');
const Grupos = require('../models/Grupos');
const {check} = require('express-validator');
const multer = require('multer');//p subir imagenes
const shortid=require('shortid');//para id

const configuracionMulter={
    storage:fileStorage=multer.diskStorage({
        destination:(req,file,next)=>{
            next(null,__dirname+'/../public/uploads/grupos');
        },
        filename:(req,file,next)=>{
            const extension=file.mimetype.split('/')[1];
            next(null,`${shortid.generate()}.${extension}`)
        }
    })
}

const upload= multer(configuracionMulter).single('imagen');
//subir imagen en el server
exports.subirImagen=(req,res,next)=>{
    upload(req,res,function(error){
        if(error){
            console.log(error);
            //TODO: Manejar errores
        }else{
            next();
        }
    })
}

exports.formNuevoGrupo = async (req,res) =>{
    const categorias = await Categorias.findAll();
    res.render('nuevo-grupo',{
        nombrePagina:'Crea un nuevo grupo',
        categorias
    })
}
//alamcena grupos en la db
exports.crearGrupo = async(req,res)=>{
    await check('nombre').escape().run(req);
    await check('url').escape().run(req);
    const grupo = req.body;
    //almacena el usuario autenticado como el creador del grupo
    grupo.usuarioId=req.user.id;

    grupo.imagen=req.file.filename;

    try {
        await Grupos.create(grupo);

        req.flash('exito','Se ha creado el grupo correctamente');
        res.redirect('/administracion');
    } catch (error) {
        console.log(error);
        const erroresSequelize = error.errors ? error.errors.map(err => err.message) : [];
        req.flash('error',erroresSequelize);
        res.redirect('/nuevo-grupo');
    }
}
