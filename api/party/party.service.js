const dbService = require('../../services/db.service')
const reviewService = require('../review/review.service')
const { forEach } = require('lodash')
const ObjectId = require('mongodb').ObjectId
// const {ISODate} = require('mongodb')

module.exports = {
  query,
  getById,
  remove,
  update,
  add,
  getPartyLocations,
  addPartyReview
}

async function query(filterBy) {
  const sortBy = _buildSortBy(filterBy)
  const criteria = _buildCriteria(filterBy)
  const collection = await dbService.getCollection('party')
  try {
    const partys = await collection.find(criteria).sort(sortBy).toArray()
    // const partys = await collection.find().sort(sortBy).toArray()
    // const partys = await collection.find().toArray();

    return partys
  } catch (err) {
    console.log('ERROR: cannot find partys')
    throw err
  }
}

// Get current start of day and start of tomorrow
const now = Date.now(),
    oneDay = 1000 * 60 * 60 * 24,
    today = new Date(now - (now % oneDay)),
    tomorrow = new Date(today.valueOf() + oneDay),
    dayAfterTommarow = new Date(today.valueOf() + (2 * oneDay)),
    nextWeek = new Date(today.valueOf() + (7 * oneDay))

function _buildCriteria(filterBy) { 
  const criteria = {}
  if (filterBy.fee) {
    criteria.fee = { $lte: +filterBy.fee }
  }
  // 
  if (JSON.parse(filterBy.partyTypes).length > 0) {
    criteria['extraData.partyTypes'] = { $in: JSON.parse(filterBy.partyTypes) }
  }

  if (JSON.parse(filterBy.locations).length > 0) {
    criteria['location.name'] = { $in: JSON.parse(filterBy.locations) }
  }

  if(filterBy.userLocation && filterBy.distance){
    const userLocation = JSON.parse(filterBy.userLocation)
    criteria.location = 
        { $near :
           {
              $geometry: { coordinates: [ userLocation.pos.lat, userLocation.pos.lng ] },
              $maxDistance: +filterBy.distance*1000,
            //  $maxDistance: 5000
           }
        }
  }

  if (filterBy.startTime) {
    if (filterBy.startTime === 'All') {
      criteria.startDate = {
        $gte: today,
      }
    } else if (filterBy.startTime === 'Today') {
      criteria.startDate = {
        $gte: today,
        $lt: tomorrow,
      }
    } else if (filterBy.startTime === 'Tomorrow') {
      criteria.startDate = {
        $gte: tomorrow,
        $lt: dayAfterTommarow,
      }
    } else if (filterBy.startTime === 'Next 7 Days') {
      criteria.startDate = {
        $gte: today,
        $lt: nextWeek,
      }
    } else if (filterBy.startTime === 'Old Events') {
      criteria.startDate = {
        $lt: today,
      }
    }
  }

  return criteria
}

// TODO marge with build critiria
function _buildSortBy(filterBy) {
  const sortBy = {}
  if (filterBy.sortBy) {
    // filterBy._order = filterBy._order === 'asc' ? 1 : -1
    // sortBy[filterBy._sort] = filterBy._order
    sortBy[filterBy.sortBy] = filterBy.sortBy === 'startDate' ? 1 : -1
  }
  return sortBy
}

async function addPartyReview(review){
  const collection = await dbService.getCollection('party')
  try {
    const party = await collection.findOne({ _id: ObjectId(review.currPartyId) })
    const partyReviews = party.extraData.reviews
    partyReviews.unshift(review)


    collection.updateOne(
      { _id: ObjectId(review.currPartyId)},
      { $set: { "extraData.reviews": partyReviews }},
    )
    return party
  } catch (err) {
    console.log(`ERROR: while finding party ${review.currPartyId}`)
    throw err
  }
}

async function getById(partyId) {
  const collection = await dbService.getCollection('party')
  try {
    const party = await collection.findOne({ _id: ObjectId(partyId) })
    return party
  } catch (err) {
    console.log(`ERROR: while finding party ${partyId}`)
    throw err
  }
}

async function getPartyLocations() {
  const collection = await dbService.getCollection('party')
  try {
    const partys = await collection.find().toArray()
    let locations = partys.map((party) => party.location.name)
    let newSet = new Set(locations)
    let uniqueLocations = Array.from(newSet)
    return uniqueLocations
  } catch (err) {
    console.log(`ERROR: while finding party ${partyId}`)
    throw err
  }
}

async function remove(partyId) {
  const collection = await dbService.getCollection('party')
  try {
    await collection.deleteOne({ _id: ObjectId(partyId) })
  } catch (err) {
    console.log(`ERROR: cannot remove party ${partyId}`)
    throw err
  }
}

async function update(party) {
  const collection = await dbService.getCollection('party')
  party._id = ObjectId(party._id)
  party.startDate = new Date(party.startDate)
  party.endDate = new Date(party.endDate)

  try {
    await collection.replaceOne({ _id: party._id }, { $set: party })
    return party
  } catch (err) {
    console.log(`ERROR: cannot update party ${party._id}`)
    throw err
  }
}

async function add(party) {
  const collection = await dbService.getCollection('party')
  party.startDate = new Date(party.startDate)
  party.endDate = new Date(party.endDate)
  try {
    await collection.insertOne(party)
    return party
  } catch (err) {
    console.log(`ERROR: cannot insert party`)
    throw err
  }
}
