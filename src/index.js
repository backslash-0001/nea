// Import input library and functions from other file
const prompt = require("synchro-prompt");
const sqlFuns = require("./sqlFuns");
const login = sqlFuns.login;
const register = sqlFuns.register;
const createUserTable = sqlFuns.createTable;
const leaderboard = sqlFuns.leaderboard;
const updateTopScore = sqlFuns.updateScore;

// Create a function that generates number from 1-6
const throwDie = () => {
  return Math.ceil(Math.random() * 6);
}

// Create a function that gets top 5 from DB and logs to console
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

// Only needed on first run
// createUserTable();

// Main function, try-catch used to properly handle errors
try {
  console.log(`
     _      __    __ 
    | | /| / /__ / /______  __ _  ___ 
    | |/ |/ / -_) / __/ _ \\/  ' \\/ -_)
    |__/|__/\\__/_/\\__/\\___/_/_/_/\\__/ 

    To my NEA Dice Game
  `);

  // Initialise player1 & player2
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

  // Attempts authorisation of player1
  try {
  // Prompts user if they want to login or register
  if (prompt("Player 1, would you like to register or login? (R/l) ").toLowerCase() == "l") {
    console.log("Login:\n");

    // Prompts user for email & password
    let user = login({
      email: prompt("Please enter your email: "),
      pass: prompt("Please enter your password: ")
    });

    // Set player1 values to temporary values
    player1.uid = user.uid;
    player1.name = user.name;
    player1.email = user.email;
    player1.topScore = user.topScore;
  } else {
    console.log("Register:\n");

    // Prompts user for email, name & password
    let user = register({
      email: prompt("Please enter your email: "),
      name: prompt("Please enter your name: "),
      pass: prompt("Please enter a password: ")
    });

    // Sets player1 values to temporary values
    player1.uid = user.uid;
    player1.name = user.name;
    player1.email = user.email;
    player1.topScore = 0;
  }
} catch (err) {
  throw `Error with player1: ${err}`;
}

// Same as above, but with player2
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

// Checks if player1 and player2's emails are the same, if so throws error
if (player1.email == player2.email) throw `Player 1 is also Player 2`;

for (let i = 0; i < 5; i++) {
  player1.throws[i] = []
  // Appends dice rolls to array of index i in 2D array
  player1.throws[i].push(throwDie());
  player1.throws[i].push(throwDie());

  // If double roll, roll again
  if (player1.throws[i][0] == player1.throws[i][1]) player1.throws[i].push(throwDie());

  // Repeats above with player2
  player2.throws[i] = []
  player2.throws[i].push(throwDie());
  player2.throws[i].push(throwDie());

  if (player2.throws[i][0] == player2.throws[i][1]) player2.throws[i].push(throwDie());

  /* Initialise p1Score
  ** Equal to tempScore in player1 object
  ** Equal to the sum of the array with index i in throws 2D array in player1 object
  ** Repeats with p2Score & player2
  */
  let p1Score = player1.tempScore = player1.throws[i].reduce(
    (total, value) => {return total + value}
  );
  let p2Score = player2.tempScore = player2.throws[i].reduce(
    (total, value) => {return total + value}
  );

  // Check if p1Score is odd or even and adds/takes correct amount of points
  if (p1Score % 2) {
    p1Score -= 5;
    p1OddEven = "odd";
  } else {
    p1Score += 10;
    p1OddEven = "even";
  }

  // Repeats above for p2Score
  if (p2Score % 2) {
    p2Score -= 5;
    p2OddEven = "odd";
  } else {
    p2Score += 10;
    p2OddEven = "even";
  }

  // Checks if either score is < 0, if so make it 0
  p1Score = p1Score < 0 ? 0 : p1Score;
  p2Score = p2Score < 0 ? 0 : p2Score;

  // Adds temporary scores to main score
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

  // Extra rounds
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

  // Prints winner, their score, and other's score
  console.log(`
      Well Done Player ${player1.score > player2.score ? "1" : "2"}, you won, with a score of ${player1.score > player2.score ? player1.score : player2.score} compared to Player ${player1.score < player2.score ? "1" : "2"}'s score of ${player1.score < player2.score ? player1.score : player2.score}
  `);

  // Checks and prints if any player beat their top score
  console.log(`
      Player 1 ${player1.score > player1.topScore ? "beat" : "didn't beat"} their top score of ${player1.topScore}. 
      Player 2 ${player2.score > player2.topScore ? "beat" : "didn't beat"} their top score of ${player2.topScore}. 
  `)

  // If topscore beaten, update local variable for it
  if (player1.score > player1.topScore) player1.topScore = player1.score;
  if (player2.score > player2.topScore) player2.topScore = player2.score;

  // Update DB with new topscore
  updateTopScore(player1.uid, player1.topScore);
  updateTopScore(player2.uid, player2.topScore);

  prompt("Press enter to continue to the leaderboard ");

  logLeaderboard();

  prompt("Press enter to restart ");
} catch (err) {
  // If error, print it
  console.log(err);
  // Ask to restart
  prompt("Press enter to restart ");
	// Exit with non-zero error code
  process.exit(1);
}
