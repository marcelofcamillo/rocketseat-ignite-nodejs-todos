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

// should be able to create a new todo
app.post('/todos', checkExistsUserAccount, (req, res) => {
  const { user } = req;
  const { title, deadline } = req.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return res.status(201).json(todo);
});

// should be able to list all user's todos
app.get('/todos', checkExistsUserAccount, (req, res) => {
  const { user } = req;

  return res.json(user.todos);
});

// should be able to update a todo
app.put('/todos/:id', checkExistsUserAccount, (req, res) => {
  const { user } = req;
  const { title, deadline } = req.body;
  const { id } = req.params;

  const todo = user.todos.find((todo) => todo.id === id);

  // should not be able to update a non existing todo
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found!' });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return res.json(todo);
});

// should be able to mark a todo as done
app.patch('/todos/:id/done', (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const todo = user.todos.find((todo) => todo.id === id);

  // should not be able to mark a non existing todo as done
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found!' });
  }

  todo.done = true;

  return res.json(todo);
});

app.listen(3000, () => {
  console.log('API started!');
});
