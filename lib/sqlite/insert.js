const Streamz = require('streamz');
const Promise = require('bluebird');
const util = require('util');

function Insert(table, options) {
  if (!(this instanceof Streamz))
    return new Insert(table, options);

  Streamz.call(this, undefined, null, options);
  this.table = table;
  this.options = options || {};
}

util.inherits(Insert,Streamz);

Insert.prototype._fn = function(d) {
  this.table.insert(d);

  if (this.options.pushResults)
    return d.result;
};

module.exports = Insert;