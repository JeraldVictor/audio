let createError = require('http-errors');
let express = require('express');
let path = require('path');
const methodOverride = require('method-override')

let indexRouter = require('./routes/index');
let audio = require('./routes/audio');
let album = require('./routes/album');
let lyric = require('./routes/lyric')
let api = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))
app.use('/mp3', express.static(path.join(__dirname, 'public/media/songs')))

//bootstrap
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstra


app.use('/', indexRouter);
app.use('/audio', audio);
app.use('/album',album);
app.use('/lyric',lyric);
app.use('/api',api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
