var express = require('express');
var app = express();

var data = require('../data');

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

  data.recipes.forEach((recipe) => result.push(recipe.name));

  res.status(200).send({
    recipeNames: result,
  });
});

app.get('/recipes/details/:name', (req, res) => {
  let results = {};
  let new_recipe_name = req.params.name;

  // for (var x = 0; x < data.recipes.length; x++) {
  //   if (data.recipes[x].name === recipeName) {
  //     results.ingredients = data.recipes[x].ingredients;
  //     results.numSteps = data.recipes[x].instructions.length;
  //   }
  // }

  // if (results.ingredients === undefined) {
  //   res.status(200).send(results);
  // } else {
  //   res.status(200).send({
  //     details: results,
  //   });
  // }

  data.recipes.forEach((recipe) =>
    recipe.name === new_recipe_name
      ? ((results.ingredients = recipe.ingredients),
        (results.numSteps = recipe.instructions.length))
      : ''
  );

  results.ingredients === undefined
    ? res.status(200).send(results)
    : res.status(200).send({ details: results });
});

app.post('/recipes', (req, res) => {
  let new_recipe = req.body;
  let new_recipe_name = req.body.name;
  let recipe_exists = false;
  let error_string = 'Recipe already exists';

  // for (var x = 0; x < data.recipes.length; x++) {
  //   let recipeName = data.recipes[x].name;
  //   if (recipeName === new_recipe_name) {
  //     recipe_exists = true;
  //   }
  // }

  data.recipes.forEach((recipe) =>
    recipe.name === new_recipe_name ? (recipe_exists = true) : ''
  );

  recipe_exists
    ? res.status(400).send({ error: error_string })
    : (data.recipes.push(new_recipe), res.status(201).send());

  // if (recipe_exists) {
  //   res.status(400).send({
  //     error: 'Recipe already exists',
  //   });
  // } else {
  //   data.recipes.push(new_recipe);
  //   res.status(201).send();
  // }
});

app.put('/recipes', (req, res) => {
  let new_recipe = req.body;
  let new_recipe_name = req.body.name;
  let recipe_exists = false;
  let error_string = 'Recipe does not exist';

  // for (var x = 0; x < data.recipes.length; x++) {
  //   let recipeName = data.recipes[x].name;
  //   if (recipeName === new_recipe_name) {
  //     recipe_exists = true;
  //     data.recipes[x] = new_recipe;
  //   }
  // }

  // data.recipes.forEach((recipe) =>
  //   recipe.name === new_recipe_name
  //     ? ((recipe_exists = true), (recipe = new_recipe))
  //     : ''
  // );

  data = data.recipes.map((recipe) =>
    recipe.name === new_recipe_name
      ? ((recipe = new_recipe), (recipe_exists = true))
      : ''
  );

  recipe_exists ? res.status(204).send() : res.status(404).send(error_string);

  // if (!recipe_exists) {
  //   res.status(404).send({
  //     error: 'Recipe does not exist',
  //   });
  // } else {
  //   res.status(204).send();
  // }
});
