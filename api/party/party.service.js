
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

async function query(filterBy) {
    // console.log(filterBy);
    const sortBy = _buildSortBy(filterBy)
    const criteria = _buildCriteria(filterBy)
    console.log('criteria', criteria);
    // console.log('criteria', criteria);
    const collection = await dbService.getCollection('party')
    try {
        const partys = await collection.find(criteria).sort(sortBy).toArray();
        //console.log(partys);
        // const partys = await collection.find().toArray();

        return partys
    } catch (err) {
        console.log('ERROR: cannot find partys')
        throw err;
    }
}

function _buildCriteria(filterBy) {
    // { qty: { $lt: 4 } } 
    const criteria = {};
    if (filterBy.fee) {
        criteria.fee = { $lt: +filterBy.fee }
    }
    // if (filterBy.inStock_like) {
    //     criteria.inStock = JSON.parse(filterBy.inStock_like)//make the 'true' to true true
    // }
    // if (filterBy.type_like) {
    //     criteria.type = filterBy.type_like
    // }
    // if (filterBy.minBalance) {
    //     criteria.balance = {$gte : +filterBy.minBalance}
    //     // criteria.balance = {$lte : +filterBy.maxFee}
    // }
    
    return criteria;
}
function _buildSortBy(filterBy) {
    const sortBy = {};
    if (filterBy.sortBy) {
        // filterBy._order = filterBy._order === 'asc' ? 1 : -1
        // sortBy[filterBy._sort] = filterBy._order
        sortBy[filterBy.sortBy] = -1
    }
    return sortBy;
}

async function getById(partyId) {
    const collection = await dbService.getCollection('party')
    try {
        const party = await collection.findOne({"_id":ObjectId(partyId)})
        return party
    } catch (err) {
        console.log(`ERROR: while finding party ${partyId}`)
        throw err;
    }
}

async function remove(partyId) {
    const collection = await dbService.getCollection('party')
    try {
        await collection.deleteOne({"_id":ObjectId(partyId)})
    } catch (err) {
        console.log(`ERROR: cannot remove party ${partyId}`)
        throw err;
    }
}

async function update(party) {
    const collection = await dbService.getCollection('party')
    party._id = ObjectId(party._id);

    try {
        await collection.replaceOne({"_id":party._id}, {$set : party})
        return party
    } catch (err) {
        console.log(`ERROR: cannot update party ${party._id}`)
        throw err;
    }
}

async function add(party) {
    const collection = await dbService.getCollection('party')
    try {
        await collection.insertOne(party);
        return party;
    } catch (err) {
        console.log(`ERROR: cannot insert party`)
        throw err;
    }
}




