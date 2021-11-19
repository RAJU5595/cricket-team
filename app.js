const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;
let dbPath = path.join(__dirname, "cricketTeam.db");

const initializeServerAndDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initializeServerAndDB();

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
        SELECT * 
        FROM 
        cricket_team
    `;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
        INSERT INTO cricket_team (player_name,jersey_number,role)
        VALUES("${playerName}",${jerseyNumber},"${role}")
    `;
  await db.run(addPlayerQuery);
  console.log("Player Added to Team");
});
