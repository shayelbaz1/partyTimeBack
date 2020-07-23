const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

async function login(email, password) {
    // logger.debug(`auth.service - login with email: ${email}`)
    if (!email || !password) return Promise.reject('email and password are required!')
    const user = await userService.getByEmail(email)
    if (!user) return Promise.reject('Invalid email or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid email or password')

    delete user.password;
    return user;
}

async function signup(username, email, imgURL, isAdmin, isGoogle, password, goingPartys) {
    // logger.debug(`auth.service - signup with email: ${email}, username: ${username}`)
<<<<<<< HEAD
    console.log('creds in auth service:', username, email, imgURL, isAdmin, isGoogle, password, goingPartys);
=======
    // console.log('creds in auth service:', username, email, imgURL, isAdmin, isGoogle, password);
>>>>>>> 81b15302705685f3ee7f88f92bb5efa7cab2144a
    if (!isGoogle) {
        if (!email || !password || !username) return Promise.reject('email, username and password are required!')
        const hash = await bcrypt.hash(password, saltRounds)
        return userService.add({ email, password: hash, username, imgURL, isAdmin, goingPartys })

    } else if (isGoogle) {
        return userService.add({ email, username, imgURL, isAdmin, goingPartys })
    }

}

module.exports = {
    signup,
    login,
}