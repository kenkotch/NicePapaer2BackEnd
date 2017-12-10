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
    .where('id', req.payload.id)
    .then((data) => {
      role = data.role
      next()
    })
}

// C
router.post('/', auth, checkRole, (req, res, next) => {
  if (role === 2) {
    let id = req.payload.accountId
    // console.log('this is id for role 2', id)

    if (!req.body.time || !req.body.time.trim()) {
      res.status(500)
      res.render('error', {
        message: 'Time cannot be blank'
      })
    } else if (!req.body.item || !req.body.item.trim()) {
      res.status(500)
      res.render('error', {
        message: 'Item cannot be blank'
      })
    } else {
      knex('schedule')
        .insert({
          time: req.body.time,
          item: req.body.item,
          description: req.body.description,
          account_id: id
        }, '*')
        .then(() => {
          // console.log('should render')
          res.redirect('/schedule')
        })
    }
  }
})

// R info from db
router.get('/', auth, checkRole, (req, res, next) => {
  let id = req.payload.accountId

  if (role === 1) {
    role1Render(id, req, res, next)
  }

  let fName1
  let fName2
  let wedDate

  if (role === 2) {
    role2Render(id, req, res, next)
  }

  if (role === 3) {
    role3Render(id, req, res, next)
  }

})

// role 1 render
const role1Render = (id, req, res, next) => {
  id = req.query.id
  knex('account')
    .select('first_name_1', 'first_name_2', 'template.template_name', 'schedule.*')
    .where('schedule.account_id', id)
    .orderBy('time')
    .innerJoin('schedule', 'schedule.account_id', 'account.id')
    .innerJoin('template', 'template.id', 'account.template_id')
    .then((data) => {
      // console.log('data from super:', data)
      fName1 = data[0].first_name_1
      fName2 = data[0].first_name_2

      for (let i = 0; i < data.length; i++) {
        delete data[i].created_at
        delete data[i].updated_at
      }

      res.render(
        'schedule', {
          title: `Welcome to ${fName1} and ${fName2}'s wedding!`,
          data,
          role,
          _layoutFile: 'layout.ejs'
        }
      )
      return
    })
    .catch((err) => {
      next(err)
    })
}

// role 2 render
const role2Render = (id, req, res, next) => {
  knex('account')
    .select('first_name_1', 'first_name_2', 'wedding_date', 'template.template_name', 'schedule.*')
    .where('account.id', id)
    .orderBy('time')
    .innerJoin('schedule', 'schedule.account_id', 'account.id')
    .innerJoin('template', 'template.id', 'account.template_id')
    .then((data) => {
      fName1 = data[0].first_name_1
      fName2 = data[0].first_name_2

      if (data[0].wedding_date){
        wedDate = data[0].wedding_date.toString().slice(0, 15)
      } else {
        wedDate = null
      }

      for (let i = 0; i < data.length; i++) {
        delete data[i].created_at
        delete data[i].updated_at
      }

      console.log('wedDate type: ', typeof wedDate)
      console.log('wedDate:', wedDate)
      res.render(
        'schedule', {
          title: `Welcome to ${fName1} and ${fName2}'s wedding!`,
          data,
          role,
          wedDate,
          _layoutFile: 'layout.ejs'
        }
      )
    })
    .catch((err) => {
      next(err)
    })
}

// role 3 render
const role3Render = (id, req, res, next) => {
  knex('account')
    .select('first_name_1', 'first_name_2', 'wedding_date', 'template.template_name', 'schedule.*')
    .where('account.id', id)
    .orderBy('time')
    .innerJoin('schedule', 'schedule.account_id', 'account.id')
    .innerJoin('template', 'template.id', 'account.template_id')
    .then((data) => {
      fName1 = data[0].first_name_1
      fName2 = data[0].first_name_2

      if (data[0].wedding_date) {
        wedDate = data[0].wedding_date.toString().slice(0, 15)
      } else {
        wedDate = null
      }

      for (let i = 0; i < data.length; i++) {
        delete data[i].created_at
        delete data[i].updated_at
      }

      res.render(
        'scheduleGuest', {
          title: `Welcome to ${fName1} and ${fName2}'s wedding!`,
          role,
          data,
          wedDate,
          _layoutFile: 'layout.ejs'
        }
      )
    })
    .catch((err) => {
      next(err)
    })
}



// R to render from super
router.get('/:id', auth, checkRole, (req, res, next) => {
  res.render('schedule')
})

// R to go to edit page
router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  if (typeof id !== 'undefined') {
    knex('schedule')
      .select()
      .where('id', id)
      .first()
      .then((data) => {
        res.render('edit', {
          title: `something is working at id ${id}`,
          id,
          time: data.time,
          item: data.item,
          description: data.description,
          role,
          _layoutFile: 'layout.ejs'
        })
      })
  } else {
    res.status(500)
    res.render('error', {
      message: 'something went wrong'
    })
  }
})

// U
router.patch('/:id', (req, res, next) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return next()
  }

  knex('schedule')
    .where('id', id)
    .then((rows) => {
      if (!rows) {
        throw boom.create(404, 'Not Found')
      }

      const {
        time,
        item,
        description
      } = req.body
      const updateRow = {}

      if (time) {
        updateRow.time = time
      }

      if (item) {
        updateRow.item = item
      }

      if (description) {
        updateRow.description = description
      }

      knex('schedule')
        .update(updateRow, '*')
        .where('id', id)
        .then((row) => {
          res.send(row[0])
        })
    })
    .catch((err) => {
      next(err)
    })
})

// D
router.delete('/:id', (req, res, next) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return next()
  }

  let event

  knex('schedule')
    .where('id', id)
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found')
      }
      event = row

      return knex('schedule')
        .del()
        .where('id', id)
    })
    .then(() => {
      delete event.id
      res.send(event)
    })
    .catch((err) => {
      next(err)
    })
})

module.exports = router
