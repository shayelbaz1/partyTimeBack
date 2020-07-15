
const dbService = require('../../services/db.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const sortBy = _buildSortBy(filterBy)
    const criteria = _buildCriteria(filterBy)

    const collection = await dbService.getCollection('toy')
    try {

        const toys = await collection.find(criteria).sort(sortBy).toArray();

        return toys
    } catch (err) {
        console.log('ERROR: cannot find toys')
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        // criteria.name = {$regex:`.*${filterBy.txt}.*\i`}
        criteria.name = {$regex:new RegExp(filterBy.txt,'i')}
    }
    if (filterBy.inStock_like) {
        criteria.inStock = JSON.parse(filterBy.inStock_like)//make the 'true' to true true
    }
    if (filterBy.type_like) {
        criteria.type = filterBy.type_like
    }
    if (filterBy.minBalance) {
        criteria.balance = {$gte : +filterBy.minBalance}
    }
    
    return criteria;
}
function _buildSortBy(filterBy) {
    const sortBy = {};
    if (filterBy._order&& filterBy._sort) {
        filterBy._order = filterBy._order === 'asc' ? 1 : -1
        sortBy[filterBy._sort] = filterBy._order
    }

    return sortBy;
}

async function getById(toyId) {
    const collection = await dbService.getCollection('toy')
    try {
        const toy = await collection.findOne({"_id":ObjectId(toyId)})
        return toy
    } catch (err) {
        console.log(`ERROR: while finding toy ${toyId}`)
        throw err;
    }
}

async function remove(toyId) {
    const collection = await dbService.getCollection('toy')
    try {
        await collection.deleteOne({"_id":ObjectId(toyId)})
    } catch (err) {
        console.log(`ERROR: cannot remove toy ${toyId}`)
        throw err;
    }
}

async function update(toy) {
    const collection = await dbService.getCollection('toy')
    toy._id = ObjectId(toy._id);

    try {
        await collection.replaceOne({"_id":toy._id}, {$set : toy})
        return toy
    } catch (err) {
        console.log(`ERROR: cannot update toy ${toy._id}`)
        throw err;
    }
}

async function add(toy) {
    const collection = await dbService.getCollection('toy')
    try {
        await collection.insertOne(toy);
        return toy;
    } catch (err) {
        console.log(`ERROR: cannot insert toy`)
        throw err;
    }
}




