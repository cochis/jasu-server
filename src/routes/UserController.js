const { Router } = require("express");
const router = Router();

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ENV = require("../constants/constants");
const mailchimpClient = require("@mailchimp/mailchimp_transactional")(ENV.MANDRIL_API_KEY);

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, company, lang } = req.body;
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    company,
    verified: false,
  });

  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(500)
      .send(
        "backend.userController.alreadyRegistered"
      );
  }

  await newUser.save();
  const token = jwt.sign({ _id: newUser._id }, "secretKey");

  await sendRegistrationEmail(newUser, token, lang);

  return res.status(200).json({ token });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .send(
        "backend.userController.emailNotExists"
      );
  }

  if (!user.verified) {
    return res
      .status(401)
      .send(
        "backend.userController.reviewRequest"
      );
  }

  if (user.password !== password) {
    return res
      .status(401)
      .send(
        "backend.userController.incorrectPassword"
      );
  }

  const token = jwt.sign({ _id: user._id }, "secretKey");
  return res.status(200).json({ token, firstName: user.firstName, lastName: user.lastName, email: user.email, company: user.company });
});

router.post("/change-password", async (req, res) => {
  const { password, token, lang } = req.body;
  const payload = jwt.verify(token, "secretKey");
  const user = await User.findById(payload._id);

  if(!user) {
    return res
      .status(500)
      .send(
        "backend.userController.userNotExists"
      );
  }
  const title = lang === "en" ? "Your passowrd has been changed successfully." : "Tu contraseña se cambio satisfactoriamente.";
  await user.updateOne({ password });
  await sendEmail("CHANGE_PASSWORD_" + lang.toUpperCase(), title, user.email, [{
    name: "USERNAME",
    content: user.firstName
  }]);

  return res.status(200).json({ message:  "backend.userController.passwordChanged" });
});

router.post("/reset", async (req, res) => {
  const { email, lang } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(500)
      .send(
        "backend.userController.emailNotExists"
      );
  }

  if (!user.verified) {
    return res
      .status(401)
      .send(
        "backend.userController.reviewRequest"
      );
  }

  // Send email to user with instructions
  const token = jwt.sign({ _id: user._id }, "secretKey");
  const url = `${ENV.URL_FRONT}/change-password?token=${token}`
  const title = lang === 'en' ? "Password Reset Instructions: Action Required" : "Instrucciones de reinicio de contraseña: Acción requerida";

  await sendEmail("RESET_PASSWORD_" + lang.toUpperCase(), title, user.email, [
    {name: "URL_TOKEN", content: url},
    {name: "NAME", content: user.firstName + " " + user.lastName}
  ]);

  return res.status(200).json({ message: "backend.userController.instructionsPassword" });
});

router.get("/verify", async (req, res) => {
  const token = req.query.token;
  const lang = req.query.lang;
  const payload = jwt.verify(token, "secretKey");
  const user = await User.findById(payload._id);
  await user.updateOne({
    verified: true
  });

  const title = lang === 'en' ? "Welcome aboard! Your registration is complete." : "Bienvenido a bordo, Tu registro ha sido completado.";
  await sendEmail("REGISTRATION_COMPLETE_" + lang.toUpperCase(), title, user.email, [
    {name: "USERNAME", content: user.firstName + " " + user.lastName}
  ])
  res.writeHead(301, {
    Location: `${ENV.URL_FRONT}/verify`
  }).end();
});

module.exports = router;

async function sendRegistrationEmail(user, token, lang) {
  const url = `${ENV.URL_BACK}/api/verify?token=${token}&lang=${lang}`
  const title = lang === 'en' ? "Verify The Email to Complete Registration" : "Verifica el correo electrónico para completar el registro";
  await sendEmail("VERIFY_ACCOUNT_" + lang.toUpperCase(), title, ENV.EMAIL_ADMIN, [
    {name: "URL_TOKEN", content: url},
    {name: "EMAIL", content: user.email}
  ]);

  const title2 = lang === 'en' ? "Welcome to Jasu Community" : "Bienvenido a la comunidad Jasu";
  await sendEmail("WELCOME_" + lang.toUpperCase(), title2, user.email, [
    {name: "USERNAME", content: (user.firstName + " " + user.lastName).toUpperCase()}
  ]);
}

async function sendEmail(templateName, subject, to, vars) {
  const response = await mailchimpClient.messages.sendTemplate({
    template_name: templateName,
    template_content: [{}],
    message: {
      subject,
      from_email: ENV.EMAIL_FROM,
      from_name: ENV.EMAIL_TITLE,
      to: [{
        email: to
      }],
      track_clicks: true,
      merge_language: "mailchimp",
      merge_vars: [
        {
          rcpt: to,
          vars
        }
    ]
    },
  });
  console.log(response)
  return response;
}
