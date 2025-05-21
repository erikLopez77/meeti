const express = require('express');
const expressLayouts = ('express-ejs-layouts');
const path = require('path');
const router = require('./routes');
require('dotenv').config({ path: 'variables.env' });

const app = express();
//habilitar ejs
app.set(expressLayouts);
app.set('view engine', 'ejs');

//ubicacion de vistas
app.set('views', path.join(__dirname, './views'));

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//routing
app.use('/', router())

app.listen(process.env.PORT, () => {
    console.log('El sevidor esta funcionando')
})


