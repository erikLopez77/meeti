const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const router = require('./routes')();

//configuracion y modelos db
const db = require('./config/db');
const { pass } = require('./config/emails');
require('./models/Usuarios');
db.sync().then(() => console.log('DB conectada')).catch((error) => console.log(error));
//variables de desarrollo
require('dotenv').config({ path: 'variables.env' });

//app principal
const app = express();

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//habilitar ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//ubicacion de vistas
app.set('views', path.join(__dirname, 'views'));

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//habilitar cookie parser
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false

}));
//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//middleware (usuario logueado, flash messages, fecha actual)
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});
//routing
app.use('/', router)

app.listen(process.env.PORT, () => {
    console.log('El sevidor esta funcionando')
})


