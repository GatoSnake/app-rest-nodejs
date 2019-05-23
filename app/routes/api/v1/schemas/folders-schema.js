'use strict'

const Joi = require('joi')

const foldersSchema = {}

foldersSchema.post = Joi.object({
  path: Joi.string().allow(null).trim().max(255).regex(/^((\/[\w]+)|(\/[\w.-]{1}[\w .-]*[\w.-]{1}))+\/$/).required(),
  name: Joi.string().trim().max(255).regex(/^(([\w]+)|([\w.-]{1}[\w .-]*[\w.-]{1}))+$/).required()
})

module.exports = foldersSchema
