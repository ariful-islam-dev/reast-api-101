const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const shortId = require('shortid')
const fs = require('fs/promises');
const path = require('path')

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.post('/', async(req, res)=>{
    const player = {
        ...req.body,
        id: shortId.generate()
    }
    const dbLocation = path.resolve('src', 'data.json')

    const data = await fs.readFile(dbLocation)
    const players = JSON.parse(data);
    players.push(player);

    await fs.writeFile(dbLocation, JSON.stringify(players));
    res.status(201).json(player)



})

app.get("/health", (req, res) => {
  return res.status(200).json({ Status: "OK" });
});



const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on PORT ${port}`);
});
