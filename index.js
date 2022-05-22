const express = require('express');
const path = require('path');
const exphbs = require("express-handlebars");
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

express()

    .use(express.static(path.join(__dirname, 'public'))) //declaramos estático el contenido de una carpeta public
    .use("/BootstrapCss", express.static(`${__dirname}/node_modules/bootstrap/dist/css/`)) //ruta estática para disponibilizar CSS de Bootstrap
    .use("/CSS", express.static(`${__dirname}/public/css/`))
    .use("/BootstrapJs", express.static(__dirname + "/node_modules/bootstrap/dist/js/")) //ruta estática para disponibilizar Bootstrap Bundle
    .use("/Axios", express.static(__dirname + "/node_modules/axios/dist/")) //ruta estática Axios
    .use("/jQuery", express.static(__dirname + "/node_modules/jquery/dist/")) //ruta estática jQuery

    .set('views', path.join(__dirname, 'views')) //declaramos estático el contenido de una carpeta views

    .engine("handlebars", exphbs.engine({
        defaultLayout: "main",
        layoutsDir: `${__dirname}/views/mainLayout`,
    })) //para el motor de plantilla handlebars

    .set("view engine", "handlebars") //configuración de renderizado

    .get('/', (req, res) => res.render('Home')) //ruta

    .listen(PORT, () => console.log(`Listening on ${PORT}`)); //puerto
