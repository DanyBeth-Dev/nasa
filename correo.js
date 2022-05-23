const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sala10javascriptprueba@gmail.com",
      pass: "pruebajavascript",
    },
    tls: {
      rejectUnauthorized: false,
    }
  });

const enviarCorreo = async (email, nombre) => {
    let mailOptions = {
        from: "sala10javascriptprueba@gmail.com",
        to: [email],
        subject: `¡Saludos desde la NASA!`,
        html: `<h3> ¡Hola!, ${nombre}! <br> La nasa te da las gracias por subir tu foto a nuestro sistema y colaborar con las investigaciones extraterrestres. </h3>`,
    };
    await transporter.sendMail(mailOptions)
};

module.exports = enviarCorreo;