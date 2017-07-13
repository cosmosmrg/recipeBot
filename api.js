var unirest = require('unirest');
var Promise = require('bluebird');
module.exports = {
  findEntities(recipe) {
    return new Promise((resolve, reject)=>{
      unirest.get("https://community-food2fork.p.mashape.com/search?key=7aa7ef8b34dc4f50624c413ed7f4ba89&q="+recipe)
      .header("X-Mashape-Key", "AhiIivJDcDmshNjoOCs0RchW8vWvp1EU6D0jsnoCH8UhKAud8r")
      .header("Accept", "application/json")
      .end(function (result) {
        resolve( JSON.parse(result.body))
      })
    })
  },
  entityClaims (entityId) {
    return new Promise((resolve, reject)=>{
      unirest.get("https://community-food2fork.p.mashape.com/get?key=7aa7ef8b34dc4f50624c413ed7f4ba89&rId="+entityId)
      .header("X-Mashape-Key", "AhiIivJDcDmshNjoOCs0RchW8vWvp1EU6D0jsnoCH8UhKAud8r")
      .header("Accept", "application/json")
      .end(function (result) {
        resolve(JSON.parse(result.body));
      })
    })
  }
};
