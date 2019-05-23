'use strict'

const express = require('express')
const validator = require('express-joi-validation')({ passError: true })
const router = express.Router()

const foldersSchema = require('./schemas/folders-schema')
const foldersService = require('../../../services/folders')

const fs = require('fs')
const multer = require('multer')
const upload = multer({ dest: _config.temp.uploads })

/**
 * Create a folder
 * Status: 201 folder created; 404 path not found; 409 file already exist; 500 error
 */
router.post('/', validator.body(foldersSchema.post), async (req, res, next) => {
  try {
    const result = await foldersService.save(req.body)
    res.status(result.status).set({ Location: '/api/v1/folders/' + result.folder._id }).json(result.folder)
  } catch (err) {
    next(err)
  }
})

/**
 * Get all folders
 * Status: 200 success; 500 error
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await foldersService.getAll()
    res.status(result.status).json({
      list: result.list,
      total: result.list.length
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
