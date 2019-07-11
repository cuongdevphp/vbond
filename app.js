const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug')('vbond:server');
const http = require('http');
const cron = require('./cronjob');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const prefixRouter = require('./routes/prefix');
const companyRouter = require('./routes/company');
const interestRateBankRouter = require('./routes/interest_rate_bank');
const feeTradeRouter = require('./routes/fee_trade');
const bondTypeRouter = require('./routes/bond_type');
const paymentTermRouter = require('./routes/payment_term');
const commandTypeRouter = require('./routes/command_type');
const tradeStatusRouter = require('./routes/trade_status');
const branchVCSCRouter = require('./routes/branch_vcsc');
const nhdtTypeRouter = require('./routes/nhdt_type');
const roomTypeRouter = require('./routes/room_type');
const investorsRouter = require('./routes/investors');
const authPageRouter = require('./routes/auth_page');
const contractVCSCRouter = require('./routes/contract_vcsc');
const interestRateBuyRouter = require('./routes/interest_rate_buy');
const bondPriceRouter = require('./routes/bond_price');
const roomVCSCRouter = require('./routes/room_vcsc');
const ensureAssetsRouter = require('./routes/ensure_assets');
const bondsRouter = require('./routes/bonds');
const setCommandBuyRouter = require('./routes/set_command_buy');
const roomInvestorsRouter = require('./routes/room_investors');
const setCommandRouter = require('./routes/set_command');
const dateInterestYearRouter = require('./routes/date_interest_year');
const assetRouter = require('./routes/asset');
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3001');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
cron.updateBondMonth();

app.use('/', indexRouter);
app.use('/*', function(req, res, next) {
  setHeader(req, res, next);
});

app.use('/login', loginRouter);

app.use(function(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'secretkey', function (err) {
      if(err) {
        return res.status(403).json({ error: err.message });
      } else {
        next();
      }
    })
  } catch(e) {
    next();
  }
});


app.use('/users', usersRouter);
app.use('/prefix', prefixRouter);
app.use('/company', companyRouter);
app.use('/interestRateBank', interestRateBankRouter);
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
app.use('/ensureAssets', ensureAssetsRouter);
app.use('/contractVCSC', contractVCSCRouter);
app.use('/interestRateBuy', interestRateBuyRouter);
app.use('/bondPrice', bondPriceRouter);
app.use('/roomVCSC', roomVCSCRouter);
app.use('/bonds', bondsRouter);
app.use('/setCommandBuy', setCommandBuyRouter);
app.use('/roomInvestors', roomInvestorsRouter);
app.use('/setCommand', setCommandRouter);
app.use('/dateInterestYear', dateInterestYearRouter);
app.use('/assets', assetRouter);

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

const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
const hostname = '0.0.0.0';
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * set Header
 */
function setHeader(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Accept, Authorization');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  next();
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

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

  const bind = typeof port === 'string'
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
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
