Do:

1. Write simple Express server that listens on port 3000 (use dotenv to specify the port)
2. Create a dummy "database" of planets using a let variable. (You will use this data in further exercises.)
3. Configure your app (app.use()) to:
   #. accept JSON from the Client
   #. log the Client's requests

Use:

1. Dummy database with initial data:

type Planet = {
id: number,
name: string,
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

2. express-async-errors
3. morgan
