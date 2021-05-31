const db = require("../utils/db");

const table = `Reservation`;
module.exports = {
  add: function (entity) {
    return db.add(table, entity);
  },
  updateRevenues: function (rid, month) {
    const query = `CALL AddRevenues(?, ?)`;
    return db.getByCondition(query, [rid, month]);
  },
};
