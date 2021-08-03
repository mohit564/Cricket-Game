class CricketGame {
  teams = [];
  winnerTeam;

  constructor() {
    const team1 = new Team("team1");
    const team2 = new Team("team2");
    this.teams.push(team1, team2);
  }

  showResult() {
    if (this.teams[0].teamScore > this.teams[1].teamScore) {
      this.winnerTeam = this.teams[0];
    } else {
      this.winnerTeam = this.teams[1];
    }

    const winner = document.getElementById("winner-name");
    winner.textContent = this.winnerTeam.getTeamName();

    let maxRuns = -Infinity;
    this.winnerTeam.players.forEach((p) => {
      if (p.total > maxRuns) {
        maxRuns = p.total;
      }
    });

    const player = this.winnerTeam.players.find((p) => p.total === maxRuns);
    const motmName = document.getElementById("motm-name");
    const motmTeam = document.getElementById("motm-team");
    const motmScore = document.getElementById("motm-score");

    motmName.textContent = player.getPlayerName();
    motmTeam.textContent = this.winnerTeam.getTeamName();
    motmScore.textContent = `SCORE : ${player.total}`;

    setTimeout(() => {
      if (window.confirm("Do you want to play again?")) {
        window.location.replace(window.location.href);
      }
    }, 3000);
  }
}

class Team {
  players = [];
  teamScore = 0;

  constructor(name) {
    this.name = name;

    for (let i = 1; i <= 10; i++) {
      this.players.push(new Player(`player${i}`));
    }

    this.currentPlayer = this.players[0];
    this.displayScoreBoard();
  }

  getTeamName() {
    return this.name.toUpperCase().replace(/(\d)/, (_, num) => " " + num);
  }

  displayScoreBoard() {
    const target = document.querySelector(`.${this.name}-scoreboard`);

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

      table.append(thead, tbody);
      target.append(table);
    });
  }

  hitBall() {
    const player = this.currentPlayer;
    const teamTotal = document.getElementById(`${this.name}-score`);

    const run = Math.floor(Math.random() * 7);

    const playerScore = document.querySelector(
      `.${this.name}-${player.name}-B${6 - player.remainingBalls + 1}`
    );
    playerScore.textContent = run;

    if (player.remainingBalls > 1 && run) {
      player.runs.push(run);
      player.total = player.runs.reduce((score, run) => (score += run));
      player.remainingBalls--;

      this.teamScore += run;
      teamTotal.textContent = this.teamScore;
    } else {
      player.remainingBalls = 0;

      this.currentPlayer = this.players.find(
        (player) => player.remainingBalls === 6
      );
      if (!this.currentPlayer) {
        if (this.name === "team1") {
          hit1.replaceWith(hit1.cloneNode(true));
          console.log("1st Inning Runs : " + this.teamScore);
          hit2.removeAttribute("disabled");
        } else {
          hit2.replaceWith(hit2.cloneNode(true));
          console.log("2nd Inning Runs : " + this.teamScore);
          result.removeAttribute("disabled");
        }
      }
      const playerTotal = document.querySelector(
        `.${this.name}-${player.name}-total`
      );
      playerTotal.textContent = player.total;
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
  getPlayerName() {
    return this.name.toUpperCase().replace(/(\d)/, (_, num) => " " + num);
  }
}

const game = new CricketGame();

const hit1 = document.getElementById("team1-hit");
hit1.addEventListener("click", game.teams[0].hitBall.bind(game.teams[0]));

const hit2 = document.getElementById("team2-hit");
hit2.addEventListener("click", game.teams[1].hitBall.bind(game.teams[1]));

const result = document.getElementById("resultBtn");
result.addEventListener("click", game.showResult.bind(game));
