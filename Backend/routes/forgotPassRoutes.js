const express = require('express');
const nodemailer = require('nodemailer');
const UserP = require('../models/userPharmaSchema.js');
const router = express.Router();

router.post('/users/forgot-password', async (req, res) => {
    const { Email } = req.body;

    try {
        // Find the user by email
        const user = await UserP.findOne({ Email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a new password (you could also send the existing one if desired)
        const newPassword = user.normalpass; // Assuming password is stored directly, otherwise generate a new one

        // Send the email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tp20052001@gmail.com',
                pass: 'zshsyxaovwzbgdzj',
            },
        });

        const mailOptions = {
            from: 'tp20052001@gmail.com',
            to: Email,
            subject: 'Your Password',
            text: `Your password is: ${newPassword}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'New password has been sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
});

module.exports = router;