
class Table {

  constructor(db, tableName) {
    this.db = db;
    this.tableName = tableName;
    this._headers = null;
  }

  create(headers) {
    this.db.prepare(`create table ${this.tableName} (${headers.map(header => `${header.name} ${header.type}`).join(', ')})`).run();
  }

  get headers() {
    return this._headers || (this._headers = 
      this.db.prepare(`pragma table_info(${this.tableName})`)
        .all()
        .map(header => {
          header.isNumber = (header.type === 'INTEGER') || (header.type === 'REAL');
          return header;
        }));
  }

  get insertSql() {
    return this._insertSql || (this._insertSql = `INSERT INTO ${this.tableName} (${this.headers.map(d => d.name)}) VALUES (${this.headers.map(d => '?').join(', ')})`);
  }

  valueForHeader(value, header) {
    if (value === null || value === undefined) {
      return null;
    }
    if (header.isNumber) {
      value = +value;
      if (Number.isNaN(value)) {
        return null;
      }
    }
    return value;
  }

  insert(records) {
    if (!Array.isArray(records)) {
      records = [records];
    }
    let headers = this.headers;
    this.db.transaction(records.map(record => this.insertSql))
        .run([].concat.apply([], records.map(record => 
          headers.map(header => 
            this.valueForHeader(record[header.name], header)))))
  }
}

module.exports = Table;