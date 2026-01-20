const { sendMail } = require("../utils/mailer");

exports.testMail = async (req, res) => {
  try {
    await sendMail({
      to: "lumina.store.in@gmail.com",
      subject: "Lumina Test Mail",
      html: "<h1>Mail system working ✅</h1>",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({ error: "Mail failed" });
  }
};
