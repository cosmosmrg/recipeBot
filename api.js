var unirest = require('unirest');
var Promise = require('bluebird');
module.exports = {
  findEntities(recipe) {
    return new Promise((resolve, reject)=>{
      unirest.get(
        "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?"
        +"instructionsRequired=true&limitLicense=false&number=10&offset=0&query="+recipe)
      .header("X-Mashape-Key", "AhiIivJDcDmshNjoOCs0RchW8vWvp1EU6D0jsnoCH8UhKAud8r")
      .header("Accept", "application/json")
      .end(function (result) {
        resolve( result.body)
      })
    })
  },
  entityClaims (entityId) {
    return new Promise((resolve, reject)=>{
      unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com"
      +"/recipes/informationBulk?ids="+entityId+"&includeNutrition=false")
      .header("X-Mashape-Key", "AhiIivJDcDmshNjoOCs0RchW8vWvp1EU6D0jsnoCH8UhKAud8r")
      .header("Accept", "application/json")
      .end(function (result) {
        resolve(result.body);
      })
    })
  },
  findInText(text){
    return new Promise((resolve, reject)=>{
      unirest.post("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/detect")
      .header("X-Mashape-Key", "AhiIivJDcDmshNjoOCs0RchW8vWvp1EU6D0jsnoCH8UhKAud8r")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .header("Accept", "application/json")
      .send("text="+text)
      .end(function (result) {
          resolve(result.body);
      })
    })

  }
};
