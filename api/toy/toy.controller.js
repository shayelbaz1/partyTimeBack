const toyService = require('./toy.service')
const logger = require('../../services/logger.service')

async function getToy(req, res) {
    const toy = await toyService.getById(req.params.id)
    res.send(toy)
}
  
async function getToys(req, res) {
    const toys = await toyService.query(req.query)
    logger.debug(toys);
    res.send(toys)
}

async function deleteToy(req, res) {
    await toyService.remove(req.params.id)
    res.end()
}

async function updateToy(req, res) {
    const toy = req.body;
    await toyService.update(toy)
    res.send(toy)
}

async function addToy(req, res) {
    const toy = req.body;
    await toyService.add(toy)
    res.send(toy)
}

module.exports = {
    getToy,
    getToys,
    deleteToy,
    updateToy,
    addToy
}