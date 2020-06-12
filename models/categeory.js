const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categeorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  orders: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
 
});

module.exports = mongoose.model('Categeory', categeorySchema);
