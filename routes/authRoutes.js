const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');

require('dotenv').config();

const nodemailer = require("nodemailer");

/////////////////////////////////  CHECK THAT URL IS WORKING OR NOT  /////////////////////////
// router.get('/home', (req,res) => {
//     res.send("Hello World");
// })

// router.post('/verify',(req,res) => {
//     console.log(req.body);
//     // write in json format 
//     // {
//     //     "email": "priyankakhambadkar@gmail.com"
//     // }
// })



async function mailer(receiveremail, code){
    // console.log("Mailer function called");

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:587,

        secure: false,  // true for 456 , false for other ports
        requireTLS: true,
        auth: {
            user: process.env.NodeMailer_email,  // generate ethereal user
            pass: process.env.NodeMailer_password,  // generate ethereal password
        }
    })


    let info = await transporter.sendMail({
        from: "Instagram",
        to: receiveremail,
        subject: "Email Verification",
        // text: 
        // `Dear Candidate,
        // One Time Password (OTP) to verify your email is ${code}.Please do not share this One Time Password with anyone.

        // In case you have not requested for OTP, Please ignore.`,
        html: `
        <html>
        <body>
            Dear Candidate,
            <p>One Time Password (OTP) to verify your email is <strong>${code}</strong>.Please do not share this One Time Password with anyone.</p>
            <p>In case you have not requested for OTP, Please ignore this email.</p>
        </body>
        </html>
    `,


    })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
router.post('/verify',(req,res) => {
    const { email } = req.body;

    // If Json Format is write like this { "email":"" }    OUTPUT-->> {"error": "Please add all the fields" }
    // If Json Format is write like this { "email":"priyankakhambadkar@gmail.com" }    OUTPUT-->> {"error": "Email sent" }
    if(!email){
        return res.status(422).json({ error : "Please add all the fields"});
    }
    else{      
        // Check that you type the email is alredy exist or not. If not then save that email
        User.findOne({ email: email})  
        .then(async (savedUser) => {
            // console.log((savedUser));
            // return res.status(200).json({ message : "Email sent"});
            if(savedUser){
                return res.status(422).json({ message : "Invalid Credentials"});
            }
            // else{
            //     console.log((savedUser));
            //     return res.status(200).json({ message : "Email sent"});
            // }
            try{
                let VerificationCode = Math.floor(100000 + Math.random()*900000);
                await mailer(email, VerificationCode);

                return res.status(200).json({ message : "Email sent", VerificationCode, email});
            }catch(err){
                // console.error("Error in mailer:", err);
                return res.status(500).json({ error: "Error sending email" });

            }
        })
        // .catch(error => {
        //     console.error("Error in findOne:", error);
        //     return res.status(500).json({ error: "Internal server error" });
        // });
        // return res.status(200).json({ message : "Email sent"});
    }
})


// router.post('/verify',(req,res) => {
//     // console.log("verify route called");
//     // return res.send("verify route called");
//     // console.log(req.body);
//     const { email } = req.body;

//     if(!email){
//         return res.status(422).json({ error : "Please add all the fields"});
//     }
//     else{        
//         return res.status(200).json({ message : "Email sent"});
//     }
// })


module.exports = router;