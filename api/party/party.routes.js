const express = require('express')
const { requireAuth, requireAdmin, requireCreator } = require('../../middlewares/requireAuth.middleware')
const { getPartyLocations, getParty, getPartys, deleteParty, updateParty, addParty } = require('./party.controller')
const router = express.Router()


router.get('/', getPartys)
router.get('/locations', getPartyLocations)
// router.put('/addPartysDistance', addPartysDistance)
router.get('/:id', getParty)
router.post('/',requireAuth, addParty)
router.put('/:id',requireCreator, updateParty,)
router.delete('/:id', deleteParty)

module.exports = router