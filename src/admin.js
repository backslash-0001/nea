const resetTable = require("./sqlFuns").resetTable;
const createTable = require("./sqlFuns").createTable;
const prompt = require("synchro-prompt");

console.log("Welcome to the admin console");

if (prompt("Username: ") == "rwm" && prompt("Password: ") == "AdminPass" && prompt("Reset table? (y/N) ").toLowerCase() == "y") {
  resetTable();
  createTable();
}
