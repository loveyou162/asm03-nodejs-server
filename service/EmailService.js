const nodemailer = require("nodemailer");

export const sendEmailService = async (email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "caoboi520@gmail.com",
      pass: "fkoppiaoufurhuyw",
    },
  });
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <caoboi520@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Signup Succeeded!", // Subject line
    text: "Signup Succeeded!2", // plain text body
    html: "<h1>You successfully signed up</h1>", // html body
  });
  return info;
};
