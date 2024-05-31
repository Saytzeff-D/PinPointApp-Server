const express = require('express')
const { filterRestaurant } = require('../controllers/map.controller')
const MapRouter = express.Router()

MapRouter.post('/filter', filterRestaurant)

module.exports = MapRouter