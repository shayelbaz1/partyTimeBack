const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getPartyLocations, getParty, getPartys, deleteParty, updateParty,addParty} = require('./party.controller')
const router = express.Router()


router.get('/', getPartys)
router.get('/locations', getPartyLocations)
router.get('/:id', getParty)
router.post('/', addParty)
router.put('/:id', updateParty)
router.delete('/:id', deleteParty)

module.exports = router