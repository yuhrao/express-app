const { Schema, model } = require('mongoose')

const PetSchema =
  Schema({
    name: {
      type: String,
      required: true
    },
    age: Number,
    type: String
  })

module.exports = model('PetSchema', PetSchema)