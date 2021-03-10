const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
  // what is the value of req.user????
  console.log('req.user:', req.user);

  // identify each user's clearance level:
  let userClearanceLevel = req.user.clearance_level;

  // create variable so we can conditionally set sqlText
  let sqlText = `SELECT * FROM "secret"
                 WHERE "secrecy_level" <= $1;`

  // Alternatively:
  // if (userClearanceLevel < 3) {
  //   sqlText = `SELECT * FROM "secret"
  //   WHERE "secrecy_level" < 3;`
  // }
  // else if (userClearanceLevel < 6) {
  //   sqlText = `SELECT * FROM "secret"
  //   WHERE "secrecy_level" < 6;`
  // }
  // else if (userClearanceLevel <= 12) {
  //   sqlText = `SELECT * FROM "secret"
  //   WHERE "secrecy_level" <= 12;`
  // }
  // else {
  //   sqlText = `SELECT * FROM "secret";`
  // }

  pool
    .query(sqlText, [userClearanceLevel])
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
