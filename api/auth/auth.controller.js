const authService = require('./auth.service')
const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const { OAuth2Client } = require('google-auth-library');



async function logingoogle(req, res) {
    const { id_token } = req.body
    async function verify() {
        const CLIENT_ID = '533525570890-vp3jb7kpae7rd3pjk943bhstsbp3gtgi.apps.googleusercontent.com'
        const client = new OAuth2Client('533525570890-vp3jb7kpae7rd3pjk943bhstsbp3gtgi.apps.googleusercontent.com');
        const ticket = await client.verifyIdToken({ idToken: id_token, audience: CLIENT_ID, });
        const userInfo = ticket.getPayload();
        const userid = userInfo['sub'];
        const { sub, name,email,picture } = userInfo
        // check if user is in db
        let user = await userService.getByEmail(email)
        // if no user found by email so signup
        if (!user) user = await authService.signup(name, email, picture)
        // then sign in
        try {
            req.session.user = user;
            res.json(user)
        } catch (err) {
            res.status(401).send({ error: err })
        }
    }
    verify().catch('Error in varify',console.error);
}

async function login(req, res) {
    const { email, password } = req.body
    try {
        const user = await authService.login(email, password)
        req.session.user = user;
        res.json(user)
    } catch (err) {
        res.status(401).send({ error: err })
    }
}

async function signup(req, res) {
    try {
        const { email, password, username, imgURL, isGoogle, goingPartys, createdPartys, isAdmin = false } = req.body
        // logger.debug(email + ", " + username + ', ' + password + ',' + isAdmin)
        if (!isGoogle) {
            const account = await authService.signup(username, email, imgURL, isAdmin, isGoogle, password, goingPartys, createdPartys)

        }
        if (isGoogle) {
            const account = await authService.signup(username, email, imgURL, isAdmin, isGoogle, password, goingPartys, createdPartys)
        }
        // logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(email, password)
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('[SIGNUP] ' + err)
        res.status(500).send({ error: 'could not signup, please try later' })
    }
}

async function logout(req, res) {
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}

module.exports = {
    login,
    signup,
    logout,
    logingoogle
}