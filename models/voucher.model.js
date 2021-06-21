const db = require("../utils/db");
const table = `voucher`;
module.exports = {
  add: function (entity) {
    return db.add(table, entity);
  },
  getAll: function () {
    // const sql = `SELECT * FROM ${table}`;
    return db.getAll(table);
  },
  getVouByResID: function (id) {
    const resID = +id;
    const query = `SELECT * FROM ${table} WHERE resID=?`;
    return db.getByCondition(query, resID);
  },
}