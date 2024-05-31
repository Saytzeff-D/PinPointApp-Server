const axios = require('axios')

/**
 * @swagger
 * tags:
 *  name: Maps
 *  description: The Map filteration API
*/

/**
 * @swagger
 * /map/filter:
 *  post:
 *    summary: filters the location of a place based on some values
 *    tags: [Maps]
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - latitude
 *              - longitude
 *              - distance
 *            properties:
 *              latitude:
 *                type: string
 *              longitude:
 *                type: string
 *              distance:
 *                  type: string
 *            example:
 *              latitude: 51.50848194136378
 *              longitude: -0.07071648508463113
 *              distance: 100
 *    responses:
 *      200:
 *        description: Location fetched successfully 
 *      500:
 *        description: Internal Server Error 
 *    
 */
const filterRestaurant = (req, res)=>{
    let payload = req.body
    axios.get(
        `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${payload.longitude},${payload.latitude},${payload.distance}&bias=proximity:${payload.longitude},${payload.latitude}&limit=20&apiKey=${process.env.MAP_API_KEY}`
    ).then(result=>{
        return res.status(200).json({data: result.data.features})
    }).catch(err=>{        
        res.status(500).json({message: 'Internal Server Error'})
    })
}

module.exports = { filterRestaurant }