if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const engine = require('ejs-mate')

const register = require('./routes/register')
const login = require('./routes/login')
const token = require('./routes/token')
const schedule = require('./routes/schedule')
const profile = require('./routes/profile')
const superuser = require('./routes/super')

const app = express()

// CORS fix
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// view engine setup
app.set('view engine', 'ejs')
app.engine('ejs', engine)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', login)
app.use('/register', register)
app.use('/login', login)
app.use('/token', token)
app.use('/schedule', schedule)
app.use('/profile', profile)
app.use('/super', superuser)


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  console.log('DYING WITH 500', err)
  res.status(err.status || 500)
  res.send('Big fat error')
})

module.exports = app
