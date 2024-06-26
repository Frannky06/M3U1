var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var session = require('express-session');
var pool = require('./models/bd')
var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/admin/login');
var adminRouter = require('./routes/admin/novedades');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session ({
  secret: 'EstoEsBoca1234',
  resave: false,
  saveUnitialized: true
}))

secured = async (req, res, next) => {
  try {
    console.log(req.session.id_usuario);
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login')
    }
  } catch (error) {
    console.log(error);
  }
}

app.use(fileUpload ({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));


 app.use('/', indexRouter);
 app.use('/users', usersRouter);
 app.use('/admin/login', loginRouter);
 app.use('/admin/novedades', secured, adminRouter);
//select
// pool.query('select * from empleados').then(function (resultados) {
//   console.log(resultados)
// })
//insert
// var obj = {
//   nombre: 'Juan',
//   apellido: 'Lopez',
//   trabajo: 'docente',
//   edad: 38,
//   salario: 1500,
//   mail: 'juanlopez@gmail.com'
// } 

// pool.query('insert into empleados set ?', [obj]).then(function (resultados) {
//   console.log(resultados)
// })
//modify
// var id = 10;
// var obj = {
//   nombre: 'Pablo',
//   apellido: 'Simona'
// }
// pool.query('update empleados set ? where id_emp=?', [obj, id]).then (function (resultados) {
//   console.log(resultados)
// });
//eliminar
// var id = 23;
// pool.query('delete from empleados where id_emp=?', [id]).then(function (resultados) {
//   console.log(resultados)
// })


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
