const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerDocs = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const mongoose = require('mongoose')

const options = {
    explorer: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'PinPointApp API DOCS',
            version: '0.0.1',
            description: 'Rest API Swagger Documentation for the PinPoint App'
        }
    },
    servers: [
        {
            url: 'https://pinpoint-server.onrender.com/'            
        }
    ],
    apis: [
        './controllers/*.js'        
    ],
    failOnErrors: true
}

const specs = swaggerDocs(options)
app.use('/api', swaggerUI.serve, swaggerUI.setup(specs))
app.use(cors({origin: '*'}))
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))
app.use(bodyParser.json({limit:'50mb'}));

mongoose.connect(process.env.URI).then(res=>{
    console.log('Mongo DB connected successfully')
}).catch(err=>{
    console.log('Mongo Database has refused to connect', err)
})

app.listen(process.env.PORT, ()=> console.log(`PinPoint Server is now listening on port ${process.env.PORT}`))