// Catch all, log, prompt, exit

const prompt = require("synchro-prompt");
const sqlFuns = require("./sqlFuns");
const login = sqlFuns.login;
const register = sqlFuns.register;
const createUserTable = sqlFuns.createTable;
const leaderboard = sqlFuns.leaderboard;
const updateTopScore = sqlFuns.updateScore;

const throwDie = () => {
  return Math.ceil(Math.random() * 6);
}

const logLeaderboard = () => {
  console.log(`
    *******************
    *** LEADERBOARD ***
    *******************
    # Name       Score
  `)

  for (let i = 0; i < leaderboard().length; i++) {
    let name = leaderboard()[i].name;
    let score = leaderboard()[i].topScore;

    if (name.length > 10) {
      name = name.substr(0,7) + "...";
    } else {
      while (name.length < 10) {
        name += " ";
      }
    }

    console.log(`    ${i+1} ${name} ${score}`);
  }

}

// logLeaderboard();
// console.log(sqlFuns.getAll())
// createUserTable();
try {
console.log(`
   _      __    __                  
  | | /| / /__ / /______  __ _  ___ 
  | |/ |/ / -_) / __/ _ \\/  ' \\/ -_)
  |__/|__/\\__/_/\\__/\\___/_/_/_/\\__/ 

  To my NEA Dice Game
`);

const player1 = {
  uid: 0,
  name: "",
  email: "",
  topScore: 0,
  throws: [],
  tempScore: 0,
  score: 0
};

const player2 = {
  uid: 0,
  name: "",
  email: "",
  topScore: 0,
  throws: [],
  tempScore: 0,
  score: 0
};

try {
  if (prompt("Player 1, would you like to register or login? (R/l) ").toLowerCase() == "l") {
    console.log("Login:\n");

    let user = login({
      email: prompt("Please enter your email: "),
      pass: prompt("Please enter your password: ")
    });

    player1.uid = user.uid;
    player1.name = user.name;
    player1.email = user.email;
    player1.topScore = user.topScore;
  } else {
    console.log("Register:\n");

    let user = register({
      email: prompt("Please enter your email: "),
      name: prompt("Please enter your name: "),
      pass: prompt("Please enter a password: ")
    });

    player1.uid = user.uid;
    player1.name = user.name;
    player1.email = user.email;
    player1.topScore = 0;
  }
} catch (err) {
  throw `Error with player1: ${err}`;
}

try {
  if (prompt("\nPlayer 2, would you like to register or login? (R/l) ").toLowerCase() == "l") {
    console.log("Login:\n");

    let user = login({
      email: prompt("Please enter your email: "),
      pass: prompt("Please enter your password: ")
    });

    player2.uid = user.uid;
    player2.name = user.name;
    player2.email = user.email;
    player2.topScore = user.topScore;
  } else {
    console.log("Register:\n");

    let user = register({
      email: prompt("Please enter your email: "),
      name: prompt("Please enter your name: "),
      pass: prompt("Please enter a password: ")
    });

    player2.uid = user.uid;
    player2.name = user.name;
    player2.email = user.email;
    player2.topScore = 0;
  }
} catch (err) {
  throw `Error with player2: ${err}`;
}

if (player1.email == player2.email) throw `Player 1 is also Player 2`;

for (let i = 0; i < 5; i++) {
  player1.throws[i] = []
  player1.throws[i].push(throwDie());
  player1.throws[i].push(throwDie());

  if (player1.throws[i][0] == player1.throws[i][1]) player1.throws[i].push(throwDie());

  player2.throws[i] = []
  player2.throws[i].push(throwDie());
  player2.throws[i].push(throwDie());

  if (player2.throws[i][0] == player2.throws[i][1]) player2.throws[i].push(throwDie());

  let p1Score = player1.tempScore = player1.throws[i].reduce(
    (total, value) => {return total + value}
  );
  let p2Score = player2.tempScore = player2.throws[i].reduce(
    (total, value) => {return total + value}
  );

  if (p1Score % 2) {
    p1Score -= 5;
    p1OddEven = "odd";
  } else {
    p1Score += 10;
    p1OddEven = "even";
  }

  if (p2Score % 2) {
    p2Score -= 5;
    p2OddEven = "odd";
  } else {
    p2Score += 10;
    p2OddEven = "even";
  }

  p1Score = p1Score < 0 ? 0 : p1Score;
  p2Score = p2Score < 0 ? 0 : p2Score;

  player1.score += p1Score;
  player2.score += p2Score;

  console.log(`
    ***************
    *** ROUND ${i + 1} ***
    ***************

    Player 1 Rolled a ${player1.throws[i][0]} and a ${player1.throws[i][1]}
    ${player1.throws[i][2] ? `This double means they had a third roll of ${player1.throws[i][2]}` : ''}

    Player 2 Rolled a ${player2.throws[i][0]} and a ${player2.throws[i][1]}
    ${player2.throws[i][2] ? `This double means they had a third roll of ${player2.throws[i][2]}` : ''}

    Because their total score for this round was ${p1OddEven}, player 1 ${p1OddEven == "odd" ? "lost 5 points" : "gained 10 points"}.
    Because their total score for this round was ${p2OddEven}, player 2 ${p2OddEven == "odd" ? "lost 5 points" : "gained 10 points"}.

    This means for this round Player 1 scored ${p1Score}${i == 0 ? "." : `, giving them a total so far of ${player1.score}.`}
    Also, for this round, Player 2 scored ${p2Score}${i == 0 ? "." : `, giving them a total so far of ${player2.score}.`}
  `);
  prompt("Press enter to continue ");
}

while (player1.score == player2.score) {
  player1.throws.push(throwDie());
  player2.throws.push(throwDie());

  player1.score += player1.throws[player1.throws.length - 1];
  player2.score += player2.throws[player2.throws.length - 1];

  console.log(`
    *********************
    *** EXTRA ROUND ${player1.throws.length} ***
    *********************

    Player 1 rolled a ${player1.throws[player1.throws.length - 1]} bringing their total to ${player1.score}, whilst Player 2 rolled a ${player2.throws[player2.throws.length - 1]} bringing their total to ${player2.score}.
  `);
  prompt("Press enter to continue ");
}

console.log(`
    ***************
    *** RESULTS ***
    ***************
`)

console.log(`
    Well Done Player ${player1.score > player2.score ? "1" : "2"}, you won, with a score of ${player1.score > player2.score ? player1.score : player2.score} compared to Player ${player1.score < player2.score ? "1" : "2"}'s score of ${player1.score < player2.score ? player1.score : player2.score}
`);

console.log(`
    Player 1 ${player1.score > player1.topScore ? "beat" : "didn't beat"} their top score of ${player1.topScore}. 
    Player 2 ${player2.score > player2.topScore ? "beat" : "didn't beat"} their top score of ${player2.topScore}. 
`)

if (player1.score > player1.topScore) player1.topScore = player1.score;
if (player2.score > player2.topScore) player2.topScore = player2.score;

updateTopScore(player1.uid, player1.topScore);
updateTopScore(player2.uid, player2.topScore);

prompt("Press enter to continue to the leaderboard ");

logLeaderboard();

prompt("Press enter to restart ")
} catch (err) {
	console.log(err);
	prompt("Press enter to restart ");
	process.exit(1)
}
