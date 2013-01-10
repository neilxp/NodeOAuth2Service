var mongoose = require('mongoose');
require("../model/apps");

var util = require('util');

var crypto = require('crypto') ;

var App = mongoose.model('Apps');

/*
 * GET home page.
 */

exports.index = function(req, res){
  App.find({}, function(err, docs){
    res.render('apps/index', {apps: docs});
  });
//  res.send('rhr');
//  res.render('apps/index', {apps: {}));
};

exports.post = function (req, res){
  console.log(util.inspect(req.body));
  res.redirect('back');
};

exports.add = function(req, res){
  var key = crypto.randomBytes(8).toString('hex');
  var secret = crypto.randomBytes(16).toString('hex');
  var app = new App({
    client_key: key
  , client_secret: secret
  , name: '桌面客户端'
  });
  app.save(function(err){
    res.redirect('/apps');
  });
}

exports.edit = function(req, res){
  var id = req.params.id;
  App.findById( id, function(err, doc){
    res.render('apps/edit', {id: id, app: doc});
  }); 
}

exports.view = function(req, res){
  var id = req.params.id;
  App.findById( id, function(err, doc){
    if (err){
      res.send("I don't have that", 404);
      res.end();
    } else res.render('apps/view', {id: id, app: doc});
  }); 
}
