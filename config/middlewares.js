'use strict'

const express = require('express')
const path = require('path')
// const favicon = require('serve-favicon')
// const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const ejs = require('ejs')

module.exports = (app) => {
  logger.info('Initializing middlewares ...')

  // Middleware: engine view
  app.set('views', path.join(__dirname, '../app/views'))
  app.engine('html', ejs.renderFile)
  app.set('view engine', 'html')

  // Middleware: session
  app.use(session({
    secret: _config.session.secret,
    resave: false,
    saveUninitialized: false
  }))

  // Middleware: favicon
  //  uncomment after placing your favicon in /public
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

  // Middleware: access log (morgan)
  //  uncomment if you want to see access logs
  // app.use(morgan('dev'));

  // Middleware: body-parser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: false
  }))

  // Middleware: cookie-parser
  app.use(cookieParser())

  // Middleware: Static resources
  app.use(express.static(path.join(__dirname, '../public')))
}
