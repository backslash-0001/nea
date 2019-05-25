let exportFuns = {};

exportFuns.password = (pass) => {
  // if (pass.toUpperCase() == pass) throw `No lowercase included in password`;
  // if (pass.toLowerCase() == pass) throw `No uppercase included in password`;
  if (pass.length < 4) throw `Password shorter than 4 characters`;
  if (/\s/.test(pass)) throw `Whitespace included in password`;
  return true;
};

exportFuns.email = (email) => {
  if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) throw `Email not valid`;
  return true;
};

exportFuns.ascii = (str) => {
  if (!/[A-Za-z\s]+/.test(str)) throw `Invalid Characters in Name`;
  return true;
};

module.exports = exportFuns;
