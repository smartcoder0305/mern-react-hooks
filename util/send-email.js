const mailgun = require("mailgun-js");

const sendEmail = async (email, subject, text) => {
  try {
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      publicApiKey: process.env.MAILGUN_PUBLIC_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
      host: "api.mailgun.net",
    });

    const data = {
      from: `${subject} <no-reply@user-verification.pl>`,
      to: email,
      // bcc: ,
      subject,
      html: `<h1>${subject}</h1><p>${text}</p>`
    };

    await mg.messages().send(data);

    console.log("email sent successfully");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = sendEmail;