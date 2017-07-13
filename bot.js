var botBuilder = require('claudia-bot-builder'),
    fbTemplate = botBuilder.fbTemplate,
    excuse = require('huh'),
    api = require('./api'),
    eTitle = entity => ((entity.title || '') + ' by ' + (entity.publisher || '')),
    format = text => (text && text.substring(0, 80));
var Promise = require('bluebird');

module.exports = botBuilder((request,apiReq) => {
  apiReq.lambdaContext.callbackWaitsForEmptyEventLoop = false;
  return api.findEntities(request.text)
    .then((entities) => {
      if (entities.count<1) {
      return `Unfortunately, could not find anything about ${request.text}`;
      }
      else if (entities.count === 1) {
        let title = 'Ingredient of ' + eTitle(entities.recipes[0]);
        return api.entityClaims(entities.recipes[0].recipe_id)
              .then((claims) => {
                  return title + ':\n' + claims.recipe.ingredients.join('\n');
                }
              );
      }
      else {
        const generic = new fbTemplate.generic();
        entities.recipes.slice(0, 9).forEach(entity => {
          generic.addBubble(format(entity.title), format(entity.publisher+"\n Ranking :"+entity.social_rank))
              .addButton('View Ingredient', entity.title)
              .addImage(entity.image_url);
        });
        return generic.get();
      }
    })
    .catch(function (e) {
      return "Something happens "+request.text+"\n" +e.message;
    });
});
