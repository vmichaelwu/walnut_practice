var express = require('express');
var app = express();

const fs = require('fs');
const controller = require('../server/controller.js');

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

app.get('/recipes', controller.fetchAllRecipes);
app.get('/recipes/details/:name', controller.fetchSpecificRecipe);

app.post('/recipes', controller.postNewRecipe);

app.put('/recipes', controller.editRecipe);
