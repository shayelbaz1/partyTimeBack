const fs = require('fs')
const toys = require('../data/toy.json')
const _ = require("lodash");

module.exports = {
    query,
    remove,
    getById,
    save
}


/* this function return all the requested toys
it gets a filter object by default txt is '' and minPrice is =
first we ask for all the toys vendors that includes what in filterBy.txt
then on those toys we ask for all the toys that the price is bigger then filterBy.minPrice*/
// QUERY
function query(filterBy = {txt: ''}) {
    console.log('filterBy toy-service:', filterBy)
    
    toys.forEach((toy, idx) => {
        toy.idx = idx;
        toy.name = toy.name.toLowerCase();
    })
    // SEARCH
    var filteredToys = toys.filter(toy => toy.name.includes(filterBy.txt))
    // filter type
     filteredToys = filteredToys.filter(toy => toy.type.includes(filterBy.type_like))
    console.log('filterBy.inStock_like before:', filterBy.inStock_like)
    if (filterBy.inStock_like) {
        console.log('filterBy.inStock_like before:', filterBy.inStock_like)
        filterBy.inStock_like = JSON.parse(filterBy.inStock_like)
        console.log('filterBy.inStock_like after:', filterBy.inStock_like)
        filteredToys = filteredToys.filter(toy => toy.inStock===filterBy.inStock_like)
    }
    
    // ORDER-name
    if (filterBy._sort === 'name') {
        if (filterBy._order === "asc") {
            filteredToys.sort(asc);
        } else if (filterBy._order === "desc") {
            filteredToys.sort(desc);
        }
    }
    // ORDER-price
    else if (filterBy._sort === 'price') {
        if (filterBy._order === "asc") {
            filteredToys.sort((a,b)=>a.price-b.price);
        } else if (filterBy._order === "desc") {
            filteredToys.sort((a,b)=>b.price-a.price);
        }
    }
    // ORDER-id
    else if (filterBy._sort === '_id') {
        if (filterBy._order === "asc") {
            filteredToys.sort((a,b)=>a._id-b._id);
        } else if (filterBy._order === "desc") {
            filteredToys.sort((a,b)=>b._id-a._id);
        }
    }

    


    // PAGINATION
    const startIdx = parseInt(filterBy.startIdx) || 0;
    const limit = parseInt(filterBy.limit)
    if (filterBy.limit)
        filteredToys = filteredToys.slice((startIdx * limit), (startIdx * limit) + limit)

    return Promise.resolve(filteredToys);
}
function asc(a, b) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
  }
function desc(a, b) {
    if ( a.name > b.name ){
      return -1;
    }
    if ( a.name < b.name ){
      return 1;
    }
  }

// REMOVE
function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx >= 0) toys.splice(idx, 1)
    _saveToysToFile()
    return Promise.resolve();
}

// GET BY ID
function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy);
}

// SAVE
function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        toys.splice(idx, 1, toy);
    } else {
        toy._id = _makeId();
        toys.unshift(toy);
    }
    _saveToysToFile()
    return Promise.resolve(toy)
}


// Save Toys to File
function _saveToysToFile() {
    fs.writeFileSync('data/toy.json', JSON.stringify(toys, null, 2));
}

// Make Id
function _makeId(length = 5) {
    var txt = '';
    // var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var possible = '0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
