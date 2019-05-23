'use strict'

const ObjectID = require('mongodb').ObjectID
const uuidv4 = require('uuid/v4')
const fs = require('fs')
const _ = require('lodash/core')

const Folder = require('../models/folder')

const foldersService = {}

/**
 * Create a folder
 * @param  {object} [folderReq] folder's data
 * @return {object} folder info
 *
 * Status: 201 folder created; 404 path not found; 409 file already exist; 500 error
 */
foldersService.save = (folderReq) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check if exists parent path
      if (folderReq.path) {
        const resultParent = await Folder.findParent(folderReq.path)
        if (_.isEmpty(resultParent)) {
          const error = new Error('Path not found')
          error.status = 404
          throw error
        }
      }
      // add folder to db
      const folder = new Folder({ name: folderReq.name })
      if (folderReq.path) folder.path = folderReq.path
      var result = await folder.save()
      resolve({ status: 201, folder: result })
    } catch (err) {
      let error = null
      if (err.code === 11000) {
        error = new Error('Folder already exists')
        error.status = 409
      }
      if (!err.status) err.status = 500
      reject(error || err)
    }
  })
}

/**
 * Get all folders
 * @return {array[object]} folder list
 *
 * Status: 200 success; 500 error
 */
foldersService.getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const list = await Folder.find({})
      resolve({ status: 200, list: list })
    } catch (err) {
      if (!err.status) err.status = 500
      reject(err)
    }
  })
}

module.exports = foldersService
