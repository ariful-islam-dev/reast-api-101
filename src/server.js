const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const shortId = require("shortid");
const fs = require("fs/promises");
const path = require("path");
const res = require("express/lib/response");
const dbLocation = path.resolve("src", "data.json");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/:id", async (req, res) => {
  const id = req.params.id;

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);

  const player = players.find((item) => item.id === id);

  if (!player) {
    return res.status(404).json({ message: "Player Not Found" });
  }

  res.status(200).json(player);
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);

  let player = players.find((item) => item.id === id);
  console.log(player);

  if (!player) {
    player = {
      ...req.body,
      id: shortId.generate(),
    };
    players.push(player);
  } else {
    // player = {
    //   id: player.id,
    //   ...req.body,
    // };
    // player.id,
    player.name=req.body.name
    player.country=req.body.country
    player.rank=req.body.rank
  }

  await fs.writeFile(dbLocation, JSON.stringify(players));

  res.status(200).json(player);
});

app.delete('/:id', async(req, res)=>{
    const id = req.params.id;

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);

  const player = players.find((item) => item.id === id);

  if (!player) {
    return res.status(404).json({ message: "Player Not Found" });
  }
  const newPlayers = players.filter((item)=>item.id !== id);

  await fs.writeFile(dbLocation, JSON.stringify(newPlayers));

  res.status(203).json({message: 'Delete Successful'})

})

app.patch("/:id", async (req, res) => {
  const id = req.params.id;

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);

  const player = players.find((item) => item.id === id);

  if (!player) {
    return res.status(404).json({ message: "Player Not Found" });
  }

  player.name = req.body.name || player.name;
  player.country = req.body.country || player.country;
  player.rank = req.body.rank || player.rank;

  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(203).json(player);
});

app.post("/", async (req, res) => {
  const player = {
    ...req.body,
    id: shortId.generate(),
  };

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);
  players.push(player);

  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(201).json(player);
});

app.get("/", async (req, res) => {
  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);

  res.status(201).json(players);
});

app.get("/health", (req, res) => {
  return res.status(200).json({ Status: "OK" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on PORT ${port}`);
});
