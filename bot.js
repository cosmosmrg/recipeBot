var botBuilder = require('claudia-bot-builder'),
    fbTemplate = botBuilder.fbTemplate,
    excuse = require('huh'),
    api = require('./api'),
    eTitle = entity => ((entity.title || '') + ' by ' + (entity.publisher || '')),
    format = text => (text && text.substring(0, 80));
var Promise = require('bluebird');
const botTyping = new fbTemplate.ChatAction('typing_on'),
      botPause = new fbTemplate.Pause(1000);
module.exports = botBuilder((request,apiReq) => {
  apiReq.lambdaContext.callbackWaitsForEmptyEventLoop = false;
  var res;
  if (request.text.startsWith("find")){
    const keyword = request.text.substring(4)
    res = api.findEntities(keyword)
          .then((entities) => {
            if (entities.count<1) {
              return [ botTyping.get(),
                botPause.get(),`Unfortunately, could not find anything about ${keyword}`];
            }
            else{
              const generic = new fbTemplate.generic();
              entities.recipes.slice(0, 9).forEach(entity => {
                generic.addBubble(format(entity.title), format(entity.publisher+"\n Ranking :"+entity.social_rank))
                    .addButton('View Ingredient', "GET"+entity.recipe_id)
                    .addImage(entity.image_url);
              });
              return [ botTyping.get(),
                botPause.get(),generic.get()];
            }
          })
          .catch(function (e) {
            return [ botTyping.get(),
              botPause.get(),"Something happens "+keyword+"\n" +e.message]
          });
  }
  else if (request.text.startsWith("GET")){
    const id = request.text.substring(3)
    res = api.entityClaims(id)
            .then((claims) => {
                let title = 'Ingredient of ' + eTitle(claims.recipe);
                return [ botTyping.get(),
                  botPause.get(),title + ':\n' + claims.recipe.ingredients.join('\n')];
            })
            .catch(function (e) {
                return [ botTyping.get(),
                  botPause.get(),"Something happens "+"Getting result is"+"\n" +e.message];
            })

  }
  else{
    res = [ botTyping.get(),
      botPause.get(),
      'to find recipe\n type \'find {keyword} \' ']
  }
  return res
});
