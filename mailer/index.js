const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.SITE_EMAIL,
        pass: process.env.SITE_PASSWORD
    }
})

const mailOption = (code, email)=>{
    return {
        from: `PinPoint ${process.env.SITE_EMAIL}`,
        to: email,
        subject: `${code} is your PinPoint Verification Code`,
        html: `
            <center style='font-size: large;'>
                <div style='flex:0 0 auto; width:66.666666%'>
                    <center style='margin-bottom: 25px;'>
                        <img src='https://res.cloudinary.com/ololadedavid15/image/upload/v1717169049/pinpoint_logo-removebg-preview_tsqnia.png' />
                    </center>
                    <div style='text-align: left'>
                        <b>Here's your verification code</b>
                    </div>
                    <p style='text-align: left'>
                        Hi!
                    </p>
                    <p style='text-align: left'>
                        Please use this OTP to verify your account:
                    </p>
                    <h1 style='color: #223C73; letter-spacing: 4px;'>
                        ${code}
                    </h1>
                    <p style='text-align: left'>
                        For security purposes, please do not share this code with anyone.
                    </p>
                    <p style='text-align: left'>
                        Regards,
                    </p>
                    <p style='text-align: left'>
                        The PinPoint Team
                    </p>
                </div>
            </center>
        `
    }
}

module.exports = { transporter, mailOption }