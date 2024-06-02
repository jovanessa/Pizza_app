const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Provera da li je JWT_SECRET definisan
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const app = express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

// Povezivanje s bazom podataka
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'pica'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Dohvaćanje svih pica
app.get('/pizzas', (req, res) => {
  const query = 'SELECT * FROM pizzas';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching pizzas:', err);
      res.status(500).json({ error: 'Error fetching pizzas' });
      return;
    }
    res.json(results);
  });
});

// Dodavanje nove pice
app.post('/pizzas', (req, res) => {
  const { name, description, imageUrl, toppings, quantity, price } = req.body;
  const query = 'INSERT INTO pizzas (name, description, image_url, quantity, price) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, description, imageUrl, quantity, price], (err, result) => {
    if (err) {
      console.error('Error adding pizza:', err);
      res.status(500).json({ error: 'Error adding pizza' });
      return;
    }
    res.json({ success: true, insertedId: result.insertId });
  });
});

// Dodavanje narudžbine
app.post('/orders', (req, res) => {
  const { name, description, image_url, quantity, price } = req.body;
  console.log('Received order data:', { name, description, image_url, quantity, price });
  const query = 'INSERT INTO orders (name, description, image_url, quantity, price) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, description, image_url, quantity, price], (err, result) => {
    if (err) {
      console.error('Error placing order:', err);
      res.status(500).json({ error: 'Error placing order', details: err });
      return;
    }
    res.json({ success: true, insertedId: result.insertId });
  });
});

// Dohvaćanje svih narudžbina
app.get('/orders', (req, res) => {
  const query = 'SELECT * FROM orders';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Error fetching orders' });
      return;
    }
    res.json(results);
  });
});

// Brisanje stavki iz korpe
app.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const query = 'DELETE FROM orders WHERE id = ?';
  connection.query(query, [orderId], (err, result) => {
    if (err) {
      console.error('Error deleting order:', err);
      res.status(500).json({ error: 'Error deleting order' });
      return;
    }
    res.json({ success: true });
  });
});

// Dohvaćanje svih korisnika
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Error fetching users' });
      return;
    }
    res.json(results);
  });
});

// Registracija korisnika
app.post('/users/register', async (req, res) => {
  console.log(req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Please provide a username and password" });
    }

    connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length > 0) {
        res.status(400).json({ message: 'Username already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error executing registration query:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Prijavljivanje korisnika
app.post('/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Please provide a username and password" });
    }

    connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error executing login query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (!results.length || !(await bcrypt.compare(password, results[0].password))) {
        res.status(401).json({ message: 'Username or Password is incorrect' });
        return;
      } else {
        const id = results[0].user_id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const cookieOptions = {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
          httpOnly: true
        };
        res.cookie('userSave', token, cookieOptions);
        res.status(200).json({ token });
      }
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Provera da li je korisnik prijavljen
app.get('/users/checklogin', (req, res) => {
  const token = req.cookies.userSave; 

  if (token) {
    // Ako postoji token, korisnik je prijavljen
    res.status(200).json({ loggedIn: true });
  } else {
    // Ako ne postoji token, korisnik nije prijavljen
    res.status(401).json({ loggedIn: false });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
