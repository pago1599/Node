import "dotenv/config";
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import Joi from "joi";
import { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.get("/api/planets", (req, res) => {
  res.status(200).json(planets);
});

app.get("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  if (planet) {
    res.status(200).json(planet);
    return;
  }
  res.status(404).send("Planet not found");
});

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

app.post("/api/planets", (req, res) => {
  const { id, name } = req.body;
  const newPlanet = { id, name };
  const validatedNewPlanet = planetSchema.validate(newPlanet);

  if (validatedNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validatedNewPlanet.error.details[0].message });
  } else {
    planets = [...planets, newPlanet];
    res.status(201).json({ msg: "The planet was created" });
  }
});

app.put("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));
  res.status(200).json({ msg: "The planet was updated" });
});

app.delete("/api/planets/:id", (req, res) => {
  const { id } = req.params;
  planets = planets.filter((p) => p.id !== Number(id));
  res.status(200).json({ msg: "The planet was deleted" });
});

app.listen(port, () => {
  console.log(`Express app listening on port http://localhost:${port}`);
});
