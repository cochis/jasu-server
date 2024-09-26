const { Router } = require("express");
const router = Router();
const Contact = require("../models/Contact");
const ENV = require("../constants/constants");
const mailchimpClient = require("@mailchimp/mailchimp_transactional")(
  ENV.MANDRIL_API_KEY
);

router.post("/contact", async (req, res) => {
  const { fullName, email, phone, company, area, message, lang } = req.body;
  const newContact = new Contact({
    fullName,
    email,
    phone,
    company,
    area: area || "-",
    message,
  });

  await newContact.save();

  const title =
    lang === "en"
      ? "Message Received: New Contact via Jasu Platform."
      : "Mensaje recibido: Nuevo contacto por el sitio web.";
  await sendEmail("CONTACT_US_" + lang.toUpperCase(), title, ENV.EMAIL_ADMIN, [
    { name: "NAME", content: newContact.fullName },
    { name: "EMAIL", content: newContact.email },
    { name: "PHONE", content: newContact.phone },
    { name: "COMPANY", content: newContact.company },
    { name: "AREA", content: newContact.area },
    { name: "MESSAGE", content: newContact.message },
  ]);

  return res.status(200).json(newContact);
});

module.exports = router;

async function sendEmail(templateName, subject, to, vars) {
  const response = await mailchimpClient.messages.sendTemplate({
    template_name: templateName,
    template_content: [{}],
    message: {
      subject,
      from_email: ENV.EMAIL_FROM,
      from_name: ENV.EMAIL_TITLE,
      to: [
        {
          email: to,
        },
      ],
      track_clicks: true,
      merge_language: "mailchimp",
      merge_vars: [
        {
          rcpt: to,
          vars,
        },
      ],
    },
  });
  console.log(response);
  return response;
}
