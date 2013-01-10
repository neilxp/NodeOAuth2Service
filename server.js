
/**
 * Module dependencies.
 */
var express = require('express')
  , apps = require('./controller/apps')
  , users= require('./controller/users')
  , sessions= require('./controller/sessions')
  , oauth2= require('./controller/oauth2')
  , config = require('./config')
  , mongoose = require('mongoose')
var RedisStore = require('connect-redis')(express);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
//  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret:config.session_secret, store: new RedisStore}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.helpers({
    config: config
});

// Routes
/*
app.get('/', apps.index);

/*app.all('/user/:id/:op?', function(req, res, next){
  req.user = users[req.params.id];
  if (req.user) {
    next();
  } else {
    next(new Error('cannot find user ' + req.params.id));
  }
});

app.param('userid', function(req, res, next, id){
  req.user = users[id];
  if (req.user){
    next();
  }
  else{
    next(new Error('failed to find user'));
  }
});
*/

app.dynamicHelpers({
  session: function(req, res){
    return req.session;
  },
  flash: function(req, res){
    return req.flash();
  }
});

function checkAuth(req, res, next){
  if (req.session.user){
    next();
  } else{
    res.redirect('/sessions/new?redir=' + req.url);
  }
}

app.get('/sessions/new', sessions.new);
app.post('/sessions/new', sessions.createNew);
app.all('/sessions/destroy', sessions.destroy);

app.get('/users', users.index);
app.get('/users/save', users.save);
app.get('/users/del', users.del);

app.get('/apps/add', apps.add);
app.get('/apps', checkAuth, apps.index);
app.get('/apps/:id', apps.view);
app.get('/apps/:id/edit', apps.edit);

app.post('/oauth2/access_token', oauth2.access_token);

app.get('/user/:id/edit', function(req, res){
  res.send('editing ' + req.user.name);
});

app.put('/user/:id', function(req, res){
  res.send('updating ' + req.user.name);
});

app.post('/post', apps.post);

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.db);

app.listen(config.port);
console.log("Express server listening in %s mode", app.settings.env);
