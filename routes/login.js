const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('login', {
    _layoutFile: 'layout.ejs',
    role: ''
  })
})

module.exports = router
