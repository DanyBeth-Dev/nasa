const res = require("express/lib/response");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    pool: true,
    tls: {
      rejectUnauthorized: false,
    }
  });

//testing nodemailer success
transporter.verify((error, success) => {
  if(error) {
    console.log(error)
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
})

const enviarCorreo = async (email, nombre) => {
    let mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: [email],
        subject: `¡Saludos desde la NASA!`,
        html: `<h3> ¡Hola!, ${nombre}! <br> La nasa te da las gracias por subir tu foto a nuestro sistema y colaborar con las investigaciones extraterrestres. </h3>`,
    };
    await transporter.sendMail(mailOptions)
};

module.exports = enviarCorreo;