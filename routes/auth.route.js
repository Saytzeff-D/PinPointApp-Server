const express = require('express')
const { register, login, verifyAcct, resendOtp, loggedInUser } = require('../controllers/auth.controller')
const { authenticate } = require('../middlewares/auth.middleware')
const AuthRouter = express.Router()

AuthRouter.post('/register', register)
AuthRouter.post('/login', login)
AuthRouter.post('/resend-otp', resendOtp)
AuthRouter.post('/verify-account', verifyAcct)
AuthRouter.get('/me', authenticate, loggedInUser)

module.exports = AuthRouter