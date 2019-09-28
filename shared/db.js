const mysql = require('mysql2/promise');


module.exports = {
  async init() {
    if (this.connection) {
      //console.log('\ndb-init: connection already exists');
      return;
    }
    //console.log('db-init: will create connection');
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT || 3306,
    });
    //console.log('\ndb-init: connection created');
  },

  async close() {
    // if lambda runs seldom(-ly?), then there's no point in keeping the connection open
    if (this.connection) {
      await this.connection
        .end()
        .then(() => { this.connection = null; });
      //console.log('\ndb-close: connection closed');
    }
  },


  async query(sql, values = [], sqlOptions = {}) {
    if (!this.connection) {
      await this.init();
    }
    //console.log('\ndb-query\n', sql, values, sqlOptions);
    const options = Object.assign(
      // defaults
      {
        nestTables: true,
      },
      sqlOptions,
    );
    options.sql = sql.trim();

    if ('yes' === process.env.DB_DEBUG) {
      console.log(this.connection.format(options.sql, values));
    }

    return this.connection
      .query(options, values)
      .then(([res]) => res);
  },


  async startTransaction() {
    if (!this.connection) {
      //console.log('\ndb-start-transaction: no connection found, will re-init');
      await this.init();
    }

    if ('yes' === process.env.DB_DEBUG) {
      console.log('START TRANSACTION');
    }

    await this.connection.query('START TRANSACTION');
    //console.log('\ndb-start-transaction: done');
  },

  async commit() {
    if (this.connection) {
      if ('yes' === process.env.DB_DEBUG) {
        console.log('COMMIT');
      }

      await this.connection.query('COMMIT');
      //console.log('\ndb-commit: done');
    }
  },

  async rollback() {
    if (this.connection) {
      if ('yes' === process.env.DB_DEBUG) {
        console.log('ROLLBACK');
      }
      await this.connection.query('ROLLBACK');
      //console.log('\ndb-rollback: done');
    }
  },
};
