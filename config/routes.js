'use strict'

const index = rootRequire('./app/routes/index')
const v1Folders = rootRequire('./app/routes/api/v1/folders')

module.exports = (app) => {
  logger.info('Initializing routes ...')

  // ****** CUSTOM MIDDLEWARES ******

  // api set accept default
  app.use('/api/v1/*', (req, res, next) => {
    req.headers['accept'] = 'application/json'
    // logger.info(JSON.stringify(req.headers));
    next()
  })

  // ****** ROUTES ******

  app.use('/', index)
  app.use('/api/v1/folders', v1Folders)

  // ERROR MIDDLEWARES

  // error 404 handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // logger error
  app.use((err, req, res, next) => {
    // logger.error(JSON.stringify(err));
    if (err.stack && err.status === 500) logger.error(err.stack)
    next(err)
  })

  // joi error
  app.use((err, req, res, next) => {
    if (err.error && err.error.isJoi) {
      res.status(400).json({
        error: err.error.toString()
      })
    } else next(err)
  })

  // detect type client error
  app.use((err, req, res, next) => {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // if (err.code === 11000) return res.status(409).json({ error: 'Resource already exists' })
      return res.status(err.status || 500).json({ error: err.message })
    } else {
      next(err)
    }
  })

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.status = err.status
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })
}
