-- Creazione delle tabelle per il sistema di gestione ristorante
-- Tabella degli utenti (camerieri e staff)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'waiter', 'chef')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabella dei tavoli
CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL UNIQUE,
    seats INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'free' CHECK (status IN ('free', 'occupied', 'reserved'))
);

-- Tabella del menu
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    available BOOLEAN DEFAULT TRUE
);

-- Tabella dei clienti
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabella delle prenotazioni
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    table_id INTEGER REFERENCES tables(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabella degli ordini
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables(id),
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'preparing', 'served', 'paid')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabella degli elementi dell'ordine
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inseriamo alcuni dati di esempio
INSERT INTO
    users (username, password, role)
VALUES
    -- Nota: in produzione, queste password dovrebbero essere hashate
    (
        'admin',
        '$2b$10$X9wSGc3bvmdUeFEiAYRl1O4Hf5XBwNstTHM9GsIZ.RoNpZ.mKZ5Tq',
        'admin'
    ),
    -- password: admin123
    (
        'cameriere1',
        '$2b$10$X9wSGc3bvmdUeFEiAYRl1O4Hf5XBwNstTHM9GsIZ.RoNpZ.mKZ5Tq',
        'waiter'
    ),
    -- password: admin123
    (
        'chef1',
        '$2b$10$X9wSGc3bvmdUeFEiAYRl1O4Hf5XBwNstTHM9GsIZ.RoNpZ.mKZ5Tq',
        'chef'
    );

-- password: admin123
INSERT INTO
    tables (number, seats)
VALUES
    (1, 2),
    (2, 4),
    (3, 6),
    (4, 8);

INSERT INTO
    menu_items (name, description, price, category)
VALUES
    (
        'Spaghetti alla Carbonara',
        'Pasta con uova, guanciale, pecorino e pepe',
        12.50,
        'primo'
    ),
    (
        'Pizza Margherita',
        'Pomodoro, mozzarella e basilico',
        8.50,
        'pizza'
    ),
    (
        'Tiramisu',
        'Dolce al caffè con mascarpone',
        6.00,
        'dessert'
    ),
    (
        'Insalata Mista',
        'Insalata mista di stagione',
        5.50,
        'antipasto'
    );