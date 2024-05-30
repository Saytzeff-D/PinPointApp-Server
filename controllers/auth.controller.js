const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
 *         - email
 *         - password
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
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
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         type:
 *           type: string  
 *           description: This may be Partner or User 
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
 *    summary: registers a new user
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
 *              - type
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            example: 
 *              email: example@gmail.com
 *              password: "example1234!"
 *              phonenum: "+2348164572165"
 *    responses:
 *      200:
 *        description: registration successful 
 *      500:
 *        description: Internal Server Error 
 *    
 */