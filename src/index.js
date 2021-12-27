const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const users = [];

// middleware
function checkExistsUserAccount(req, res, next) {
  const { username } = req.headers;

  const user = users.find((user) => user.username === username);

  // should not be able to create a new user when username already exists
  if (!user) {
    return res.status(404).json({ error: 'User not found!' });
  }

  req.user = user;

  return next();
}

// should be able to create a new user
app.post('/users', (req, res) => {
  const { name, username } = req.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(400).json({ error: 'User already exists!' });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  res.status(201).json(user);
});

app.listen(3000, () => {
  console.log('API started!');
});
