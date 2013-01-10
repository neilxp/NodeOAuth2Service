var mongoose = require('mongoose');
var Schema = mongoose.Schema
  , ObjectId = mongoose.ObjectId
  ;

var crypto = require('crypto');

var AppModel = new Schema({
    client_key  : {type: String, unique: true}
  , client_secret : {type: String }
  , name : {type: String, unique: true}
  , status : {type: String, enum: ['applying', 'developing', 'examing', 'publishing'],
      default: 'applying' }
},{
  collection: 'ot_apps'
});

mongoose.model('Apps', AppModel);
