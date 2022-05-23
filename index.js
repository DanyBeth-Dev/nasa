const express = require('express');
const path = require('path');
const exphbs = require("express-handlebars");
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const secretKey = "Shhhh";
const { nuevoUsuario, getUsuarios, setUsuarioStatus, getUsuario } = require("./consultas");

express()

  .use(express.static(path.join(__dirname, 'public'))) //declaramos estático el contenido de una carpeta public
  .use(bodyParser.urlencoded({ extended: false })) //para poder recibir la imagen por el formulario
  .use(bodyParser.json()) //para recibir el payload de las consultas put y post
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

  .post('/usuarios', async (req, res) => {
    const { email, nombre, password } = req.body;
    try {
      const results = await nuevoUsuario(email, nombre, password);
      res.status(201).send(results);
    } catch (err) {
      res.status(500).send({
        error: `Algo salió mal... ${err}`,
        code: 500
      })
    }
  })

  .put("/usuarios", async (req, res) => {
    const { id, auth } = req.body;
    try {
      const usuario = await setUsuarioStatus(id, auth);
      res.status(200).send(usuario);
    } catch (error) {
      res.status(500).send({
        error: `Algo salió mal... ${error}`,
        code: 500
      })
    }
  })

  .get("/Admin", async (req, res) => {
    try {
      const usuarios = await getUsuarios();
      res.render("Admin", { usuarios });
    } catch (error) {
      res.status(500).send({
        error: `Algo salió mal... ${error}`,
        code: 500
      })
    }
  })

  .get("/Login", function (req, res) {
    res.render("Login");
  })

  .post("/verify", async function (req, res) {
    const { email, password } = req.body;
    const user = await getUsuario(email, password);
    if (user) {
      if (user.auth) {
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + 180,
          data: user,
        },
          secretKey);
        res.send(token);
      } else {
        res.status(401).send({
          error: "Este usuario aún no ha sido validado para subir imágenes",
          code: 401,
        });
      }
    } else {
      res.status(404).send({
        error: "Este usuario no está registrado en la base de datos",
        code: 404,
      });
    }
  })

  .get("/Evidencias", function (req, res) {
    const { token } = req.query;
    jwt.verify(token, secretKey, (err, decoded) => {
      const { data } = decoded
      const { nombre, email } = data
      err ? res.status(401).send(
        res.send({
          error: "401 Unautorized",
          message: "Usted no está autorizado para estar aquí",
          token_error: err.message,
        })
      )
        : res.render("Evidencias", { nombre, email });
    });
  })

  .post("/upload", (req, res) => {
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send("No se encontró ningún archivo en la consulta");
    }
    //const { email, nombre } = req.body
    //console.log(email);
    //await send(email, nombre)
    res.send("Foto cargada con éxito");
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`)); //puerto
