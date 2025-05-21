const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const router = require('./routes')();
require('dotenv').config({ path: 'variables.env' });

const app = express();
//habilitar ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//ubicacion de vistas
app.set('views', path.join(__dirname, 'views'));

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//middleware (usuario logueado, flash messages, fecha actual)
app.use((req,res,next)=>{
    const fecha = new Date();
    res.locals.year=fecha.getFullYear();
    next();
});
//routing
app.use('/', router)

app.listen(process.env.PORT, () => {
    console.log('El sevidor esta funcionando')
})


