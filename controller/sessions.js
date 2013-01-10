var mongoose = require('mongoose');
require("../model/users");

var crypto = require('crypto') ;

exports.new = function(req, res){
  res.render('sessions/new', {locals:{redir:req.query.redir}});
};

exports.createNew = function(req, res){
  var UserModel = mongoose.model('Users');
  UserModel.auth(req.body.login, req.body.password, function(err, user){
    if (user) {
      req.session.user = user;
      res.redirect(req.body.redir || '/');
      return;
    }else{
      req.flash('warn', 'Login Failed');
      res.render('sessions/new', {locals: {redir: req.body.redir}})
    }
  });
};

exports.destroy = function(req, res){
  delete req.session.user;
  res.redirect('/apps');
};

