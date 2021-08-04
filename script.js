class CricketGame {
  teams = [];
  winner;

  constructor() {
    const team1 = new Team("team1");
    const team2 = new Team("team2");
    this.teams.push(team1, team2);
  }

  // Display winner team and man of the match player details
  showResult() {
    const winner = document.getElementById("winner-name");
    const motmName = document.getElementById("motm-name");
    const motmTeam = document.getElementById("motm-team");
    const motmScore = document.getElementById("motm-score");

    this.winner = this.getWinner();
    this.motm = this.getMotm(this.winner);

    winner.textContent = this.winner.getTeamName();
    motmName.textContent = this.motm.getPlayerName();
    motmTeam.textContent = this.winner.getTeamName();
    motmScore.textContent = `SCORE : ${this.motm.total}`;
  }

  // Returns team with highest score
  getWinner() {
    return this.teams[0].teamScore > this.teams[1].teamScore
      ? this.teams[0]
      : this.teams[1];
  }

  // Returns Man of the match player from winner team
  getMotm(winnerTeam) {
    let player;
    let maxRuns = -Infinity;

    winnerTeam.players.forEach((p) => {
      if (p.total > maxRuns) {
        maxRuns = p.total;
        player = p;
      }
    });
    return player;
  }
}

class Team {
  players = [];
  teamScore = 0;
  teamStartedPlaying = false;
  seconds = 60000;

  constructor(name) {
    this.name = name;

    // Add 10 Players to team
    for (let i = 1; i <= 10; i++) {
      this.players.push(new Player(`player${i}`));
    }
    this.currentPlayer = this.players[0];
    this.showScoreboard();
  }

  // Displays scoreboard of team
  showScoreboard() {
    const target = document.querySelector(`.${this.name}-scoreboard`);
    target.append(this.createScoreboard());
  }

  // Creates scoreboard in table format
  createScoreboard() {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    for (let i = 0; i < 8; i++) {
      const td = document.createElement("td");
      if (i === 0) {
        td.textContent = this.getTeamName();
      } else if (i === 7) {
        td.textContent = "TOTAL";
      } else {
        td.textContent = `B${i}`;
      }
      thead.append(td);
    }

    const tbody = document.createElement("tbody");
    this.players.forEach((player) => {
      const tr = document.createElement("tr");
      for (let i = 0; i < 8; i++) {
        const td = document.createElement("td");
        if (i === 0) {
          td.textContent = player.getPlayerName();
        } else if (i === 7) {
          td.className = `${this.name}-${player.name}-total`;
        } else {
          td.className = `${this.name}-${player.name}-B${i}`;
        }
        tr.append(td);
      }
      tbody.append(tr);
    });
    table.append(thead, tbody);
    return table;
  }

  // Returns team name in capital letters with space in between team and number
  getTeamName() {
    return this.name.toUpperCase().replace(/(\d)/, (_, num) => " " + num);
  }

  // Each player get chance to make run from 0 to 6. 0 means out
  hitBall() {
    const player = this.currentPlayer;
    const playerScore = document.querySelector(
      `.${this.name}-${player.name}-B${6 - player.remainingBalls + 1}`
    );
    const playerTotal = document.querySelector(
      `.${this.name}-${player.name}-total`
    );
    const teamTotal = document.getElementById(`${this.name}-score`);

    this.startInning();

    const run = Math.floor(Math.random() * 7);
    playerScore.textContent = run;

    if (player.remainingBalls > 1 && run) {
      player.runs.push(run);
      player.total = player.runs.reduce((score, run) => (score += run), 0);
      this.teamScore += run;
      teamTotal.textContent = this.teamScore;
      player.remainingBalls--;
    } else {
      player.remainingBalls = 0;
      this.currentPlayer = this.players.find((p) => p.remainingBalls === 6);
      if (!this.currentPlayer) {
        this.seconds = 0;
      }
    }
    playerTotal.textContent = player.total;
  }

  // Defines team started playing
  startInning() {
    if (!this.teamStartedPlaying) {
      if (this.name === "team1") {
        this.countdown(hit1, hit2);
      } else {
        this.countdown(hit2, result);
      }
    }
    this.teamStartedPlaying = true;
  }

  // Starts 1 minute timer for team
  countdown(disableButton, enableButton) {
    if (this.seconds === 60000) {
      this.timer = setInterval(
        this.countdown.bind(this, disableButton, enableButton),
        1000
      );
    }
    this.seconds -= 1000;
    document.querySelector(".time").textContent = this.seconds / 1000;
    if (this.seconds <= 0) {
      clearInterval(this.timer);
      document.querySelector(".time").textContent = 60;
      disableButton.replaceWith(disableButton.cloneNode(true));
      enableButton.removeAttribute("disabled");
    }
  }
}

class Player {
  runs = [];
  total = 0;
  remainingBalls = 6;

  constructor(name) {
    this.name = name;
  }

  // Returns player name in capital letters with space in between team and number
  getPlayerName() {
    return this.name.toUpperCase().replace(/(\d)/, (_, num) => " " + num);
  }
}

const game = new CricketGame();
const team1 = game.teams[0];
const team2 = game.teams[1];

const hit1 = document.getElementById("team1-hit");
const hit2 = document.getElementById("team2-hit");
const result = document.getElementById("resultBtn");

hit1.addEventListener("click", team1.hitBall.bind(team1));
hit2.addEventListener("click", team2.hitBall.bind(team2));
result.addEventListener("click", game.showResult.bind(game));
