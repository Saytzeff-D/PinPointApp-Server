const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const { transporter, mailOption } = require('../mailer');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fname
 *         - lname
 *         - username
 *         - state
 *         - city 
 *         - email
 *         - password
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user/partner
 *         business_name:
 *           type: string
 *         business_addr:
 *           type: string
 *         fname:
 *           type: string
 *         lname:
 *           type: string
 *         username:
 *           type: string
 *         dob:
 *           type: string
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         category:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         type:
 *           type: string  
 *           description: The value must be Partner or User 
 */

/**
 * @swagger
 * tags:
 *  name: BaseURL
 *  description: This is the root and base address for the rest of the endpoints
*/

/**
 * @swagger
 * /:
 *  get:
 *    summary: the umbrella under which an entire server resides
 *    tags: [BaseURL]
 *    responses:
 *      200:
 *        description: Server is Live
 *      500:
 *        description: Internal Server Error 
 *    
 */

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The user authentication API
*/

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: registers a new user/partner
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - fname
 *              - lname
 *              - username 
 *              - state
 *              - city
 *              - category
 *              - email
 *              - password
 *              - type
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            example:
 *              business_name: PinPoint
 *              business_addr: Ougadougou, Burkina Faso 
 *              fname: Elijah
 *              lname: Femi
 *              username: ElijahFemi
 *              dob: 2023-03-04
 *              state: Bayelsa
 *              city: Yenagoa
 *              category: Town
 *              email: example@gmail.com
 *              password: example1234!
 *              type: Partner
 *    responses:
 *      200:
 *        description: User/Partner Created
 *      300:
 *        description: Email Already Exist 
 *      500:
 *        description: Internal Server Error 
 *    
 */

const register = async (req, res)=>{
    let payload  = req.body
    if (req.body.type == 'PARTNER' || req.body.type == 'USER') {        
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        UserModel.findOne({email: payload.email}).then(result=>{
            if (!result) {
                payload.password = hashedPassword
                let form = new UserModel(payload)
                form.save().then(()=>{
                    sendOtpCode(payload.email, res)
                }).catch((err)=>{res.status(500).json({message: 'Internal Server Error', err})})
            } else {
                res.status(300).json({message: 'Email already exist'})
            }
        }).catch((err)=>{res.status(500).json({message: 'Internal Server Error', err})})
    } else {
        res.status(500).json({message: 'Type Value must either be USER or PARTNER'})
    }
}

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: login as a user or partner
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            example:
 *              email: example@gmail.com
 *              password: example1234!
 *    responses:
 *      200:
 *        description: Login Success
 *      300:
 *        description: Incorrect Password, User does not exist 
 *      500:
 *        description: Internal Server Error 
 *    
 */
const login = (req, res)=>{
    let payload = req.body
    UserModel.findOne({email: payload.email}).then(result=>{
        if (!result) {
            res.status(300).json({message: 'User does not exist'})
        } else {
            if (result.verified) {
                bcrypt.compare(payload.password, result.password).then(same=>{
                    if (same) {
                        generateJwt(result)
                    } else {
                        res.status(300).json({message: 'Incorrect Password'})
                    }
                }).catch(()=> res.status(500).json({message: 'Internal Server Error'}))
            } else {
                res.status(300).json({message: 'Kindly Verify your E-Mail Address'})
            }
        }
    }).catch(err=>{
        res.status(500).json({message: 'Internal Server Error'})
    })
}

const generateJwt = (result)=>{
    const access_token = jwt.sign({result}, process.env.JWT_SECRET, {expiresIn: '60m'})
    res.status(200).json({message: 'Login Success', access_token})
}

const sendOtpCode = (email, res)=>{
    let otpCode = Math.ceil(Math.random() * 1000000)
    transporter.sendMail(mailOption(otpCode, email), (err, info)=>{
        if (!err) {
            UserModel.findOneAndUpdate({email: email}, {otp: otpCode}).then(resp=>{
                res.status(200).json({success: true, message: 'OTP Code sent', email})
            })
        } else {
            res.status(200).json({success: false, message: 'Network Glitch', email, info})
        }
    })
}

/**
 * @swagger
 * /auth/resend-otp:
 *  post:
 *    summary: resends an otp code to a user's email address
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *            example:
 *              email: example@gmail.com
 *    responses:
 *      200:
 *        description: OTP Sent
 *      300:
 *        description: Network glitch, couldn't send otp
 *      500:
 *        description: Internal Server Error 
 *    
 */
const resendOtp = (req, res)=>{
    let payload = req.body
    let otpCode = Math.ceil(Math.random() * 1000000)
    transporter.sendMail(mailOption(otpCode, payload.email), (err, info)=>{
        if (!err) {
            UserModel.findOneAndUpdate({email: email}, {otp: otpCode}).then(resp=>{
                res.status(200).json({success: true, message: 'OTP Code sent', email: payload.email})
            })
        } else {
            res.status(300).json({success: false, message: 'Network Glitch', email: payload.email, info})
        }
    })
}

/**
 * @swagger
 * /auth/verify-account:
 *  post:
 *    summary: verifies user account using otp
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - otp
 *            properties:
 *              email:
 *                type: string
 *              otp:
 *                type: string
 *            example:
 *              email: example@gmail.com
 *              otp: 989890
 *    responses:
 *      200:
 *        description: Account Verified Successfully
 *      300:
 *        description: Invalid OTP code
 *      500:
 *        description: Internal Server Error 
 *    
 */
const verifyAcct = (req, res)=>{
    let payload = req.body
    UserModel.findOne({email: payload.email}).then(result=>{
        if (!result) {
            res.status(500).json({message: 'User not found'})
        } else {
            if (result.otp == payload.otp) {
                UserModel.findOneAndUpdate({email: payload.email}, {verified: true}).then(resp=>{
                    res.status(200).json({message: 'Account Verified Successfully'})
                })
            } else {
                res.status(300).json({message: 'Invalid OTP code'})
            }
        }
    }).catch(err=>res.status(500).json({message: 'Internal Server Error'}))
}

/**
 * @swagger
 * /auth/me:
 *  get:
 *    summary: gets the details of the current logged in user
 *    tags: [Auth]
 *    parameters:
 *     - in: header
 *       name: authorization
 *       schema:
 *          type: string
 *          required: true
 *    components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *    responses:
 *      200:
 *        description: User retrieved successfully
 *      500:
 *        description: Internal Server Error 
 *    
 */
const loggedInUser = (req, res)=>{
    res.status(200).json({message: 'User retrieved successfully', user: req.user[0]})
}

module.exports = { register, login, resendOtp, verifyAcct, loggedInUser }
