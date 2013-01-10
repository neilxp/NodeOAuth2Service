var mongoose = require('mongoose');
require("../model/apps");
var util = require ('util')
  , crypto = require('crypto')
  , helper = require('../lib/helper')
  , redis = require('redis')
  ;

var Apps = mongoose.model('Apps');

var db = Apps.db;

function hashUserPasswd(str){
  return str;
}

exports.access_token = function(req, res){
  Apps.where('client_key', req.body.client_id)
  .where('auth_type', 'ROPC')
  .run(
    function gotOtUserDocs(err, otUserDocs){
      if (1 != otUserDocs.length){
        return;
      }
      console.log('found the client');
    
      db.db.collection('vt_user', function(err, coll){
        coll.find({'uname': req.body.username, 'passwd': hashUserPasswd(req.body.password)}).toArray(function(err, userDocs){
          if (1 == userDocs.length){
            var accessToken = helper.randomString(256);
            console.log('accesstoken: ' + accessToken);

            var rediscli = redis.createClient();
            var hkey = 'oauth:accessToken:' + accessToken;
            rediscli.hmset(hkey, 'client', req.body.client_id, 'user', req.body.username, function(err, reply){
              rediscli.expire(hkey, 3600, function(err, reply2){}); 
            });
          } else {
            console.log('User Auth denied');
          }
        });
      });
    }
  );
  res.end();
};

