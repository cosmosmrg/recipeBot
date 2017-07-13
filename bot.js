var botBuilder = require('claudia-bot-builder'),
    fbTemplate = botBuilder.fbTemplate,
    excuse = require('huh'),
    api = require('./api'),
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
            if (entities.number<1) {
              return [ botTyping.get(),
                botPause.get(),`Unfortunately, could not find anything about ${keyword}`];
            }
            else{
              const generic = new fbTemplate.generic();
              const baseurl = "https://spoonacular.com/recipeImages/";
              entities.results.forEach(entity => {
                generic.addBubble(format(entity.title), format("Prepare time : "+entity.readyInMinutes))
                    .addButton('View Recipe', "GET"+entity.id)
                    .addImage(entity.image?
                      baseurl+encodeURI(entity.image)
                    :
                      null
                    );
              });
              return [ botTyping.get(),
                botPause.get(),generic.get()];
            }
          })
          .catch(function (e) {
            return [ botTyping.get(),
              botPause.get(),"Something happens in searching"+keyword+":\n" +e.message]
          });
  }
  else if (request.text.startsWith("GET")){
    const id = request.text.substring(3)
    res = api.entityClaims(id)
            .then((res)=> res[0])
            .then((claims) => {
                var final = [ botTyping.get(),botPause.get()]
                const title = new fbTemplate.Generic()
                      .addBubble(format(claims.title + " by "+claims.creditText),format("Prepare time :"+claims.readyInMinutes
                      +"|"+"Serving :"+claims.servings+"|"+"Like :"+claims.aggregateLikes))
                     .addImage(claims.image?
                       encodeURI(claims.image)
                     :
                     null
                      )
                     .get();
                final.push(title);
                const options = new fbTemplate.Text('What\'s you want to do next?')
                                .addQuickReply('Ingredients', 'ingre-'+id)
                                .addQuickReply('Instructions', 'inst-'+id)
                                .addQuickReply('New Recipe', '{keyword}')
                                .get();
                final.push(options);
                return final;
            })
            .catch(function (e) {
                return [ botTyping.get(),
                  botPause.get(),"Something happens in Getting result:"+"\n" +e.message];
            })

  }
  else if(request.text.startsWith("inst-")){
    const id = request.text.substring(5);
    res = api.entityClaims(id)
            .then((res)=> res[0])
            .then((claims) => {
                var final = [ botTyping.get(),botPause.get()]
                final.push(new fbTemplate.text("Instructions :").get())
                if(claims.analyzedInstructions){
                  var arr =Array.apply(null, Array(Math.floor(claims.analyzedInstructions[0].steps.length/4)+1))
                  .map(function (_, i) {return i;});
                  arr.forEach((i)=>{
                    claims.analyzedInstructions[0].steps.slice(i*4,i*4+4).forEach((instruction) =>{
                      const st = "Step :"+(instruction.number)+"\n"+instruction.step;
                      if(st.length>640){
                        var arr =Array.apply(null, Array(Math.floor(st.length/640)+1))
                        .map(function (_, i) {return i;});
                        arr.forEach((i)=>{
                          final.push(new fbTemplate.text(st.substring(i*640,i*640+640))
                            .get());
                        })
                      }
                      else{
                        final.push(new fbTemplate.text(st).get())
                      }
                    })
                  })
                }else{
                  const clean_instruction = claims.instructions.split("  ").join(" ");
                  if(clean_instruction.length>640){
                    var arr =Array.apply(null, Array(Math.floor(clean_instruction.length/640)+1))
                    .map(function (_, i) {return i;});
                    arr.forEach((i)=>{
                      final.push(new fbTemplate.text(clean_instruction.substring(i*640,i*640+640))
                        .get());
                    })
                  }
                  else{
                    final.push(new fbTemplate.text(clean_instruction).get())
                  }

                }
                const options = new fbTemplate.Text('What\'s you want to do next?')
                                .addQuickReply('Ingredients', 'ingre-'+id)
                                .addQuickReply('New Recipe', '{keyword}')
                                .get();
                final.push(options);
                return final;
            })
            .catch(function (e) {
                return [ botTyping.get(),
                  botPause.get(),"Something happens in Getting instructions:"+"\n" +e.message];
            })
  }
  else if(request.text.startsWith("ingre-")){
    const id = request.text.substring(6);
    res = api.entityClaims(id)
            .then((res)=> res[0])
            .then((claims) => {
                var final = [ botTyping.get(),botPause.get()]

                final.push(new fbTemplate.text("Ingredients :").get())
                var arr =Array.apply(null, Array(Math.floor(claims.extendedIngredients.length/4)))
                .map(function (_, i) {return i;});
                arr.forEach((i)=>{
                  const ingredients = new fbTemplate.List("compact");
                  claims.extendedIngredients.slice(i*4,i*4+4).forEach((ingredient) =>{
                    ingredients.addBubble(format(ingredient.name + " Amount :"
                        +ingredient.amount + " "+ingredient.unitShort),
                        format(ingredient.originalString))
                        .addImage(ingredient.image?
                          encodeURI(ingredient.image)
                        :
                        null
                        )
                  })
                  final.push(ingredients.get())
                })
                const options = new fbTemplate.Text('What\'s you want to do next?')
                                .addQuickReply('Instructions', 'inst-'+id)
                                .addQuickReply('New Recipe', '{keyword}')
                                .get();
                final.push(options);

                return final;
            })
            .catch(function (e) {
                return [ botTyping.get(),
                  botPause.get(),"Something happens in Getting ingredients :"+"\n" +e.message];
            })
  }
  else{
    res = api.findInText(request.text)
          .then((res)=>{
            var final = [ botTyping.get(),botPause.get()]
            if(res.annotations.length){
              var dishes=[]
              res.annotations.forEach((annotation)=>{
                if (annotation.tag === "dish"){
                  dishes.push(annotation);
                }
              })
              if(dishes.length>0){
                const d = new fbTemplate.Generic()
                dishes.forEach((dish)=>{
                  d.addBubble(dish.annotation)
                  .addImage(dish.image)
                  .addButton('search','find '+dish.annotation);
                })
                final.push(d.get())
              }else{
                final.push('To find recipe related, \n you can simply type \'find '
                + request.text +'\' or type name of any dish');
              }
            }
            else{
              final.push('To find recipe related, \n you can simply type \'find '
              + request.text +'\' or type name of any dish');
            }

            return final;
          })
          .catch(function (e) {
              return [ botTyping.get(),
                botPause.get(),"Something happens in searching in Texts :"+"\n" +e.message];
          })

  }

  return res
});
