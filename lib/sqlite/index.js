const Table = require('./table');

module.exports = {
  table : (db, tableName) => new Table(db, tableName),
  insert : require('./insert')
};