var mongoose = require('mongoose');
var Schema = mongoose.Schema
  , ObjectId = mongoose.ObjectId;

var crypto = require('crypto');

function hash(str){
  return crypto.createHash('sha1').update(str).digest('hex');
}

var UserModel = new Schema({
    user : {type: String, unique:true}
  , pass : {type: String, set: hash}
},{
  collection: 'ot_users'
});


UserModel.statics.auth = function (login, password, cb) {
  return this.findOne({'user': login}, function(err, doc){
    if (err){ 
      cb(err);
      return;
    }
//    console.log(doc.pass + ':' + hash(password));
  
    if ( doc !== null && doc.pass === hash(password) ) {
      cb(null, doc);
    }else
      cb(null, null);
  });
}; 

mongoose.model('Users', UserModel);

