"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const morgan_1 = __importDefault(require("morgan"));
const joi_1 = __importDefault(require("joi"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
let planets = [
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
const planetSchema = joi_1.default.object({
    id: joi_1.default.number().integer().required(),
    name: joi_1.default.string().required(),
});
app.post("/api/planets", (req, res) => {
    const { id, name } = req.body;
    const newPlanet = { id, name };
    const validatedNewPlanet = planetSchema.validate(newPlanet);
    if (validatedNewPlanet.error) {
        return res
            .status(400)
            .json({ msg: validatedNewPlanet.error.details[0].message });
    }
    else {
        planets = [...planets, newPlanet];
        res.status(201).json({ msg: "The planet was created" });
    }
});
app.put("/api/planets/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    planets = planets.map((p) => (p.id === Number(id) ? Object.assign(Object.assign({}, p), { name }) : p));
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
//# sourceMappingURL=server.js.map