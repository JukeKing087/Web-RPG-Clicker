const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('USERS')
})

router.get('/new', (req, res) => {
    res.send('New User Form')
})

module.exports = router