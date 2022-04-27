const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;
require("dotenv").config();
const nodeMail = require("nodemailer");

const static_path = path.join(__dirname, "./public");
app.use(express.static(static_path));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


async function mainMail(name, email, message) {
  const transporter = await nodeMail.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
    },
  });
  const mailOption = {
    from: process.env.GMAIL_USER,
    to: process.env.EMAIL,
    html: `You got a message from
            Email : ${email}
            Name: ${name}
            Message: ${message}`,
  };
  try {
    await transporter.sendMail(mailOption);
    return Promise.resolve("Message Sent Successfully!");
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
app.post("/contact", async (req, res, next) => {
  const {name, email, message} = req.body;
  try {
    await mainMail(name, email, message);
    res.send("Message Successfully Sent!");
  } catch (error) {
    res.send(error);
  }
});

app.listen(3000, () => console.log("Server is running!"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(port, () => {
  console.log(`This is running on ${port} `);
});
