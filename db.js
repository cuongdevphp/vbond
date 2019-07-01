
const sql = require('mssql');

const config = {
  user: 'Developer',
  password: 'Dev@1234',
  server: '10.11.0.114', 
  database: 'vBondDB',
  options: {
      encrypt: false 
  }
};
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}
