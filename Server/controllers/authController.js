
// create user account
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import userModel from "../models/userModel.js";
import transporter from '../config/nodemailer.js';

import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing details" })
    }

    try {

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "user already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({ name, email, password: hashedPassword })

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,

        })

        // sending welcome email to user 

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.body.email,
            subject: 'Welcome to our Website',
            text: `Welocome to our website (Authentication) , ${req.body.name}. Your account has been created with email id: ${email} `,

        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        res.json({ success: false, message: "Missing details" })
    }

    try {
        const existingUser = await userModel.findOne({ email })

        if (!existingUser) {
            res.json({ success: false, message: "User not exist" })
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password)
        if (!isValidPassword) {
            res.json({ success: false, message: "Wrong user crendentials" })
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true });


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}


export const logout = async (req, res) => {
    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, message: "Logged Out" })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// send verification code to user's email

export const sendVerifyOtp = async (req, res) => {
    try {

        const { userId } = req.body;
        const user = await userModel.findById(userId)

        if (user.isVerfied) {
            return res.json({ success: false, message: "User is already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;

        // 1 day
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",

            // text: `Your OTP is ${otp}. Verify your account using this OTP. Valid for One day`,

            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Verification OTP sent on the user Email " })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const verifyUserOtp = async (req, res) => {
    const { userId, otp } = req.body

    if (!userId || !otp) {
        return res.json({ success: false, message: "Invalid Details " })
    }
    try {

        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {

            res.json({ success: false, message: "Invalid OTP" })

        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: true, message: "OTP expired" })
        }


        user.isVerfied = true
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save()
        return res.json({ success: true, message: "Email verified successfully " })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }



}


// check whether user is authenticated or not 
export const isAuthencticated = async (req, res) => {

    try {

        res.json({ success: true });

    } catch (error) {

        res.json({ success: false, message: error.message })

    }

}


// password reset otp

export const sendResetotp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" })
    }

    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found " })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp;
        user.reserOtpExpireAt = Date.now() + 600000 // 10 min
        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            // text: `Dear ${user.name}, your OTP is ${otp} to reset you Password `

            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        transporter.sendMail(mailOptions)

        return res.json({ success: true, message: "OTP sent to your email" });


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


// reset user password 
export const resetPassword = async (req, res) => {
    const { email, otp, resetPassword } = req.body

    if (!email || !otp || !resetPassword) {
        return res.json({ success: false, message: "Email, OTP and Reset Password are required" })
    }

    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found " })
        }
        if (user.resetOtp !== otp || user.resetOtp === '') {
            return res.json({ success: false, message: "Invalid OTP " })
        }

        if (user.reserOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" })
        }

        const hashedPassword = await bcrypt.hash(resetPassword, 10);

        user.password = hashedPassword;

        user.resetOtp = ''
        user.reserOtpExpireAt = 0

        user.save()

        return res.json({ success: true, message: "Password has been reset successfully " })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }


}