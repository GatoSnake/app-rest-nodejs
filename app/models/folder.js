'use strict'

const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
  name: String,
  path: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
  deleted: { type: Boolean, default: false }
})

folderSchema.index({ name: 1, path: 1 }, { unique: true })

folderSchema.methods = {
  toJSON: function () {
    const obj = this.toObject()
    delete obj.deleted
    delete obj.__v
    return obj
  }
}

folderSchema.statics = {
  findParent: function (path) {
    const positions = path.split('').map((e, i) => { if (e === '/') return i }).filter(Boolean)
    const pathParent = positions.length > 1 ? path.slice(0, positions[positions.length - 2] + 1) : null
    const parent = path.slice((positions.length === 1 ? 1 : positions[positions.length - 2] + 1), positions[positions.length - 1])
    return this.find({ path: pathParent, name: parent })
  }
}

module.exports = mongoose.model('Folder', folderSchema)
