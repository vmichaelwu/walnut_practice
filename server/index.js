var express = require('express');
var app = express();

const data = require('../data');

app.listen(3000, () => {
  console.log('Server running on port http://localhost:3000');
});

const myLogger = function (req, res, next) {
  console.log('LOGGED');
  console.log('REQUEST URL:', req.url);
  next();
};

app.use(myLogger);
app.use(express.json());

app.get('/', (req, res) => {
  res.send(data);
});

app.get('/recipes', (req, res) => {
  let result = [];
  for (var x = 0; x < data.recipes.length; x++) {
    result.push(data.recipes[x].name);
  }
  res.status(200).send({
    recipeNames: result,
  });
});

app.get('/recipes/details/:name', (req, res) => {
  let results = {};
  let recipeName = req.params.name;

  for (var x = 0; x < data.recipes.length; x++) {
    if (data.recipes[x].name === recipeName) {
      results.ingredients = data.recipes[x].ingredients;
      results.numSteps = data.recipes[x].instructions.length;
    }
  }

  if (results.ingredients === undefined) {
    res.status(200).send(results);
  } else {
    res.status(200).send({
      details: results,
    });
  }
});

app.post('/recipes', (req, res) => {
  let new_recipe = req.body;
  let new_recipe_name = req.body.name;
  let recipe_exists = false;

  for (var x = 0; x < data.recipes.length; x++) {
    let recipeName = data.recipes[x].name;
    if (recipeName === new_recipe_name) {
      recipe_exists = true;
    }
  }

  if (recipe_exists) {
    res.status(400).send({
      error: 'Recipe already exists',
    });
  } else {
    data.recipes.push(new_recipe);
    res.status(201).send();
  }
});

app.put('/recipes', (req, res) => {
  let new_recipe = req.body;
  let new_recipe_name = req.body.name;
  let recipe_exists = false;

  for (var x = 0; x < data.recipes.length; x++) {
    let recipeName = data.recipes[x].name;
    if (recipeName === new_recipe_name) {
      recipe_exists = true;
      data.recipes[x] = new_recipe;
    }
  }

  if (!recipe_exists) {
    res.status(404).send({
      error: 'Recipe does not exist',
    });
  } else {
    res.status(204).send();
  }
});
