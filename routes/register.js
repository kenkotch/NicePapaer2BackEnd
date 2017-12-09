const express = require('express')
const router = express.Router()
const knex = require('../knex')
const bcrypt = require('bcrypt')

let registered

router.post('/', (req, res, next) => {

  const {
    username,
    email,
    password,
    first_name_1,
    last_name_1,
    first_name_2,
    last_name_2
  } = req.body

  if (!username || !username.trim()) {
    res.status(400)
    res.send('Username must not be empty')
    return
  }

  if (!email || !email.trim()) {
    res.status(400)
    res.send('Email must not be empty')
    return
  }

  if (!password || !password.trim()) {
    res.status(400)
    res.send('Password must not be empty')
    return
  }

  if (!first_name_1 || !first_name_1.trim()) {
    res.status(400)
    res.send('First_name_1 must not be empty')
    return
  }

  if (!last_name_2 || !last_name_2.trim()) {
    res.status(400)
    res.send('Last_name_1 must not be empty')
    return
  }

  if (!first_name_2 || !first_name_2.trim()) {
    res.status(400)
    res.send('First_name_2 must not be empty')
    return
  }

  if (!last_name_2 || !last_name_2.trim()) {
    res.status(400)
    res.send('Last_name_2 must not be empty')
    return
  }

  let wedding_date = req.body.wedding_date || null

  bcrypt.hash(password, 5, (err, hash) => {
    knex('account')
      .insert({
        username,
        email,
        hashed_password: hash,
        first_name_1,
        last_name_1,
        first_name_2,
        last_name_2,
        wedding_date,
        role: 2
      }, '*')
      .then((data) => {
        delete data.created_at
        delete data.updated_at
        delete data.hashed_password

        knex('account')
          .update({
            account_id: data[0].id
          })
          .where('id', data[0].id)
          .then(() => {

            knex('schedule')
              .insert({
                time: 'hide',
                item: '',
                description: '',
                account_id: data[0].id
              })
              .then(() => {
                registered = data
                res.status(200)
                res.send(registered[0])
              })
          })
      })
      .catch((err) => {
        next(err)
      })
  })
})

router.get('/', (req, res, next) => {
  res.render('register', {
    registered,
    _layoutFile: 'layout.ejs',
    role: ''
  })
})

module.exports = router
