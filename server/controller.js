const fs = require('fs');

module.exports = {
  fetchAllRecipes: (req, res) => {
    let result = [];

    fs.readFile('data.json', 'utf8', (err, data) => {
      let parsedData = JSON.parse(data);

      parsedData.recipes.forEach((recipe) => result.push(recipe.name));

      res.status(200).send({
        recipeNames: result,
      });
    });
  },
  fetchSpecificRecipe: (req, res) => {
    let results = {};
    let new_recipe_name = req.params.name;

    fs.readFile('data.json', 'utf8', (err, data) => {
      let parsedData = JSON.parse(data);

      parsedData.recipes.forEach((recipe) =>
        recipe.name === new_recipe_name
          ? ((results.ingredients = recipe.ingredients),
            (results.numSteps = recipe.instructions.length))
          : ''
      );

      results.ingredients === undefined
        ? res.status(200).send(results)
        : res.status(200).send({ details: results });
    });
  },
  postNewRecipe: (req, res) => {
    let new_recipe = req.body;
    let new_recipe_name = req.body.name;
    let recipe_exists = false;
    let error_string = 'Recipe already exists';

    fs.readFile('data.json', 'utf8', (err, data) => {
      let parsedData = JSON.parse(data);

      parsedData.recipes.forEach((recipe) =>
        recipe.name === new_recipe_name ? (recipe_exists = true) : ''
      );

      if (recipe_exists) {
        res.status(400).send({ error: error_string });
      } else {
        parsedData.recipes.push(new_recipe);
        fs.writeFile('data.json', JSON.stringify(parsedData), (err) => {
          if (err) {
            throw err;
          } else {
            res.status(201).send();
          }
        });
      }
    });
  },
  editRecipe: (req, res) => {
    let new_recipe = req.body;
    let new_recipe_name = req.body.name;
    let recipe_exists = false;
    let error_string = { error: 'Recipe does not exist' };

    fs.readFile('data.json', 'utf8', (err, data) => {
      let parsedData = JSON.parse(data);

      parsedData.recipes.forEach((recipe) =>
        recipe.name === new_recipe_name ? (recipe_exists = true) : ''
      );

      let modified_recipe = parsedData.recipes.map((recipe) =>
        recipe.name === new_recipe_name ? (recipe = new_recipe) : recipe
      );

      modified_recipe = {
        recipes: modified_recipe,
      };

      const writeFile = () => {
        fs.writeFile('data.json', JSON.stringify(modified_recipe), (err) => {
          if (err) {
            console.log(err);
          } else {
            res.status(204).send();
          }
        });
      };

      recipe_exists ? writeFile() : res.status(404).send(error_string);
    });
  },
};
