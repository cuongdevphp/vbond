var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('vbond:server');
var http = require('http');
//var jwtVerifer = require('express-jwt');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var prefixRouter = require('./routes/prefix');
var companyRouter = require('./routes/company');
var interestRateRouter = require('./routes/interest_rate');
var feeTradeRouter = require('./routes/fee_trade');
var bondTypeRouter = require('./routes/bond_type');
var paymentTermRouter = require('./routes/payment_term');
var commandTypeRouter = require('./routes/command_type');
var tradeStatusRouter = require('./routes/trade_status');
var branchVCSCRouter = require('./routes/branch_vcsc');
var nhdtTypeRouter = require('./routes/nhdt_type');
var roomTypeRouter = require('./routes/room_type');
var investorsRouter = require('./routes/investors');
var authPageRouter = require('./routes/auth_page');
var loanTermRouter = require('./routes/loan_term');
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3001');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/*', function(req, res, next) {
  setHeader(res, next);
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/prefix', prefixRouter);
app.use('/company', companyRouter);
app.use('/interest', interestRateRouter);
app.use('/feeTrade', feeTradeRouter);
app.use('/bondType', bondTypeRouter);
app.use('/paymentTerm', paymentTermRouter);
app.use('/commandType', commandTypeRouter);
app.use('/tradeStatus', tradeStatusRouter);
app.use('/nhdtType', nhdtTypeRouter);
app.use('/branchVCSC', branchVCSCRouter);
app.use('/roomType', roomTypeRouter);
app.use('/investors', investorsRouter);
app.use('/authPage', authPageRouter);
app.use('/loanTerm', loanTermRouter);

app.use((err, req, res, next) => {
  if(err.email === 'UnauthorizedError') {
    res.status(500).send(err.message);
  }
});

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


app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
var hostname = '0.0.0.0';
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * set Header
 */
function setHeader(res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept,Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  next();
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
