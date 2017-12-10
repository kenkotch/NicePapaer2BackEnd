const express = require('express')
const boom = require('boom')
const router = express.Router()
const knex = require('../knex')
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_KEY

let role

const auth = (req, res, next) => {
  jwt.verify(req.cookies.token, secret, (err, payload) => {
    if (err) {
      res.status(401)
      return res.render('login', {
        msg: "We couldn't find what you're looking for, so we've taken you to our homepage.",
        _layoutFile: 'layout.ejs'
      })
    }
    // console.log("payload", payload)
    req.payload = payload
    next()
  })
}

const checkRole = (req, res, next) => {
  knex('account')
    .select('role')
    .first()
    // .innerJoin('schedule', 'schedule.account_id', 'account.account_id')
    .where('id', req.payload.id)
    .then((data) => {
      role = data.role
      // console.log("role in checkRole", role)
      next()
    })
}

// GET for super
router.get('/', auth, checkRole, (req, res, next) => {
  let id = req.payload.accountId
  console.log('req.query.id', req.query.id)

  let fName1
  let fName2
  let wedDate

  // get all accounts
  if (role === Number(1) && req.query.id === undefined) {
    console.log('in super get all')
    knex('account')
      .select('*')
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          delete data[i].hashed_password

          data[i].wedding_date ?
            data[i].wedding_date = data[i].wedding_date.toString().slice(0, 15) :
            null

        }
         return res.render(
          'superSchedule', {
            title: 'All registered accounts',
            role,
            data,
            _layoutFile: 'layout.ejs'
          }
        )
      })
      .catch((err) => {
        next(err)
      })
  }

  // else if (role === Number(1)) {
  //   console.log('getting an account schedule')
  //   knex('account')
  //     .select('first_name_1', 'first_name_2', 'template.template_name', 'schedule.*')
  //     .where('schedule.account_id', Number(req.query.id))
  //     .orderBy('time')
  //     .innerJoin('schedule', 'schedule.account_id', 'account.id')
  //     .innerJoin('template', 'template.id', 'account.template_id')
  //     .then((data) => {
  //       console.log('data from super:', data)
  //       fName1 = data[0].first_name_1
  //       fName2 = data[0].first_name_2
  //
  //       for (let i = 0; i < data.length; i++) {
  //         delete data[i].created_at
  //         delete data[i].updated_at
  //       }
  //
  //       // res.send(data)
  //       // return
  //       res.render(
  //         'schedule', {
  //           title: `Welcome to ${fName1} and ${fName2}'s wedding!`,
  //           role,
  //           data,
  //           _layoutFile: 'layout.ejs'
  //         }
  //       )
  //     })
  //     .catch((err) => {
  //       next(err)
  //     })
  // }
})

router.get('/:id', auth, checkRole, (req, res, next) => {

  knex('account')
    .select('first_name_1', 'first_name_2', 'template.template_name', 'schedule.*')
    .where('schedule.account_id', req.params.id)
    .orderBy('time')
    .innerJoin('schedule', 'schedule.account_id', 'account.id')
    .innerJoin('template', 'template.id', 'account.template_id')
    .then((data) => {
      console.log('data from super:', data)
      fName1 = data[0].first_name_1
      fName2 = data[0].first_name_2

      for (let i = 0; i < data.length; i++) {
        delete data[i].created_at
        delete data[i].updated_at
      }

      // res.send(data)
      // return
      res.render(
        'superSchedule', {
          title: `Welcome to ${fName1} and ${fName2}'s wedding!`,
          role,
          data,
          _layoutFile: 'layout.ejs'
        }
      )
    })
    .catch((err) => {
      next(err)
    })

})
















































// POST a new account or schedule item



































// UPDATE an existing account or schedule item





































// DELETE an account and/or a schedule event




module.exports = router
