const Categorias = require('../models/Categoria');
const Grupos = require('../models/Grupos');
const { check } = require('express-validator');
const multer = require('multer');//p subir imagenes
const shortid = require('shortid');//para id
const he = require('he');

const configuracionMulter = {
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname + '/../public/uploads/grupos');
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`)
        }
    }), fileFilter(req, file, next) {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            next(null, true);
        } else {
            next(new Error('Formato no válido'), false);
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');
//subir imagen en el server
exports.subirImagen = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code == 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande');
                } else {
                    req.flash('error', error.message)
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
            //TODO: Manejar errores
        } else {
            next();
        }
    })
}

exports.formNuevoGrupo = async (req, res) => {
    const categorias = await Categorias.findAll();
    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo grupo',
        categorias
    })
}
//alamcena grupos en la db
exports.crearGrupo = async (req, res) => {
    await check('nombre').escape().run(req);
    await check('url').escape().run(req);
    const grupo = req.body;
    //almacena el usuario autenticado como el creador del grupo
    grupo.usuarioId = req.user.id;
    if (req.file) {
        grupo.imagen = req.file.filename;
    }

    try {
        await Grupos.create(grupo);

        req.flash('exito', 'Se ha creado el grupo correctamente');
        res.redirect('/administracion');
    } catch (error) {
        console.log(error);
        const erroresSequelize = error.errors ? error.errors.map(err => err.message) : [];
        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-grupo');
    }
}
exports.formEditarGrupo = async (req, res) => {
    const consultas = [];
    consultas.push(Grupos.findByPk(req.params.grupoId));
    consultas.push(Categorias.findAll());

    const [grupo1, categorias] = await Promise.all(consultas);
    const grupo = {
        id: grupo1.id,
        nombre: he.decode(grupo1.nombre),
        descripcion: grupo1.descripcion,
        url: he.decode(grupo1.url),
        imagen: grupo1.imagen,
        categoriaId: grupo1.categoriaId,
        usuarioId: grupo1.usuarioId
    }
    res.render('editar-grupo', {
        nombrePagina: `Editar grupo : ${grupo.nombre}`,
        grupo,
        categorias
    });
}
exports.editarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } });
    // si no existe el grupo
    if (!grupo) {
        req.flash('error', 'Operación no válida');
        res.redirect('/administracion');
        return next();
    }

    const { nombre, descripcion, categoriaId, url } = req.body;

    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoriaId;
    grupo.url = url;

    await grupo.save();
    req.flash('exito', 'Cambios almacenados correctamente');
    res.redirect('/administracion');
}
//muestra el formulario p editar img
exports.formEditarImagen = async (req, res) => {
    const grupo = await Grupos.findByPk(req.params.grupoId);

    res.render('imagen-grupo', {
        nombrePagina: `Editar imagen grupo: ${grupo.nombre}`,
        grupo
    });

}

