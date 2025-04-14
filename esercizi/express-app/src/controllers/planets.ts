import Joi from "joi";
import { Request, Response } from "express";
import pgPromise from "pg-promise";

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

const db = pgPromise()(
  "postgres://postgres:postgresmyapp@localhost:5432/planets"
);

const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;
    
    CREATE TABLE planets (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
    );
    `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
};
setupDb();

const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets`);
  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1`,
    Number(id)
  );

  if (planet) {
    res.status(200).json(planet);
    return;
  }
  res.status(404).send("Planet not found");
};

const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validatedNewPlanet = planetSchema.validate(newPlanet);

  if (validatedNewPlanet.error) {
    res.status(400).json({ msg: validatedNewPlanet.error.details[0].message });
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
    res.status(201).json({ msg: "The planet was created" });
  }
};

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);
  res.status(200).json({ msg: "The planet was updated" });
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));
  res.status(200).json({ msg: "The planet was deleted" });
};

export { getAll, getOneById, create, updateById, deleteById };
