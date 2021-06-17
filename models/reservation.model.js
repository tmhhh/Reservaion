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
  getBookingList: function (managerID, status) {
    const query = `CALL getBookingList(?,?)`;
    return db.getByCondition(query, [managerID, status]);
  },
  confirm: function (id) {
    let entity = { status: true };
    return db.update(table, entity, id);
  },
  cancel: function (id) {
    return db.delete(table, id);
  },
};
