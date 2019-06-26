// Imports:
//    - bcrypt - password hashing module
//    - better-sqlite3 - sqlite3 handler for DB
//    - testFuns.js - library I made for validating user input
const bcrypt = require(`bcrypt`);
const sqlDb = require(`better-sqlite3`);
const db = new sqlDb(`/home/nea/dicegame.db`);
const validator = require(`./testFuns`);

let exportFuns = {};

// Function that creates the SQL table
exportFuns.createTable = () => {
  let stmt = db.prepare(`CREATE TABLE users(
                uid INTEGER PRIMARY KEY AUTOINCREMENT,
                email LONGTEXT NOT NULL,
                name LONGTEXT NOT NULL,
                pass LONGTEXT NOT NULL,
                topScore INT
              )`);
  stmt.run();
}

// Resets table
exportFuns.resetTable = () => {
  let stmt = db.prepare("DROP TABLE users");
  stmt.run();
  // stmt = db.prepare("ALTER TABLE users AUTO_INCREMENT = 0")
  // stmt.run();
}

// Test function that retrieves everything from the table
exportFuns.getAll = () => {
  return db.prepare("SELECT * FROM users").all();
}

// Creates login function
exportFuns.login = (user) => {
  if (!user.email || !user.pass) throw `Email or password is empty`;
  if (!validator.email(user.email)) throw `Email not valid`;

  let stmt = db.prepare(`SELECT * FROM users WHERE email = (?)`);

  try {
    let userSql = stmt.get(user.email);
    if (!bcrypt.compareSync(user.pass, userSql.pass)) throw `Incorrect password`;
    if (!userSql) throw `Email is incorrect`;
    return userSql;
  } catch (err) {
    throw `Error getting user from table: ${err}`;
  }
}

// Creates register function
exportFuns.register = (user) => {
  // Checks multiple regulations
  if (!user.email || !user.pass || !user.name) throw `Email, name or Password is empty`;

  validator.email(user.email);
  validator.password(user.pass);
  validator.ascii(user.name);

  let stmt = db.prepare(`SELECT * FROM users WHERE email = (?)`);
  if (stmt.get(user.email)) throw `Email already in use`;

  user.pass = bcrypt.hashSync(user.pass, 5);

  stmt = db.prepare(`INSERT INTO users (email, name, pass, topScore) VALUES (?, ?, ?, 0)`);
  let userId = stmt.run(user.email, user.name, user.pass).lastInsertRowid;
  let userSql = db.prepare(`SELECT * FROM users WHERE uid = (?)`).get(userId);

  return userSql;
}

// Function that sorts table by topScore and returns the top 5
exportFuns.leaderboard = () => {
  let all = db.prepare(`SELECT name, topScore FROM users ORDER BY topScore DESC LIMIT 5`).all();
  return all;
}

// Function that updates users' top scores
exportFuns.updateScore = (uid, score) => {
  let stmt = db.prepare(`UPDATE users SET topScore = ? WHERE uid = ?`);

  return stmt.run(score, uid);
}

module.exports = exportFuns;
