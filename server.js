const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

const cors = require('cors');

// Allow only your Vercel frontend
app.use(cors({
  origin: 'https://madriz-portfolio.vercel.app'
}));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });  

app.post('/send', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'Contact, Portofolio',
    text: `Name: ${name}\nEmail: ${email}\n\nThe Message:\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Error sending email: ' + error.message });
    }
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  });  
});

