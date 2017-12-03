/**
 * Title: RecipeHelper.js
 * Authors: Alexander Haggart
 * Date Created: 11/14/2017
 * Description: This file will interact with the DBClient to handle Recipe-related actions
 */
import React from 'react';
import DBClient from '../classes/AWSDatabaseClient';
import User from '../classes/User';



 class RecipeHelper{
    constructor(){
        this.client = DBClient.getClient();

        this.createRecipe = this.createRecipe.bind(this);
        this.loadRecipe     = this.loadRecipe.bind(this);
        this.loadRecipeBatch = this.loadRecipeBatch.bind(this);
        this.receiveRecipe  = this.receiveRecipe.bind(this);
        this.updateReview   = this.updateReview.bind(this);
        this.testUnpack = this.testUnpack.bind(this);
        this.maxRating = 5;
    }

     /**
      * Use this method to build a recipe object
      * 
      * Recipe Object Format:
      * {
      *      Name: <String> recipe Name
      *      Author: <String> username of user that created this recipe
      *      Ingredients: <List> of <String> containing one ingredient specification each
      *      Directions:  <List> of <String> containing one step each
      *      Reviews:     <List> of Review <Objects>:
      *      {
      *          username: <String> username of commenter
      *          Comment:  <String> comment assosciated with review, may be empty
      *          Rating:   <int> rating associated with review, out of 5 (stars)
      *          timestamp: timestamp of comment
      *      }
      * }
      */
    createRecipe(name,ingredients,directions){
        return {
            Name: name,
            Author: this.client.getUsername(),
            Ingredients: ingredients,
            Directions: directions,
            Reviews:{},
            TimeCost:-1,
            Difficulty:-1
        }
    }

    testUnpack(revObj){
        return this.client.getPrototype('RECIPE',revObj)
    }

    /**
     * push a new review object to the review list for the given recipe
     * review object should follow format given below
     */
    updateReview(recipeName,revObj,callback){ //TODO optimize this so we dont make two DB calls every time
        //re-pack the review object
        this.client.updateItem(//create the reviews field if it doesnt exist
            this.client.buildUpdateRequest('Recipes','Name',recipeName,this.client.buildFieldCreateExpression('Reviews',{M:{}})),
            function (e1,r1){ //chain update calls to keep them synced up
            if(e1){
                this.client.updateItem( //add the review to the reviews field once the create call resolves
                    this.client.buildUpdateRequest(
                        'Recipes',
                        'Name',recipeName,
                        this.client.buildMapUpdateExpression('Reviews',revObj.username,RecipeHelper.packReview(revObj))),
                    callback)
            } else {
                //field creation failed (!) (?)
                callback({status:false,payload:e1})
            }
        }.bind(this))
    }

    loadRecipe(recipeName,callback,custom){
        if(custom){ 
            //load recipe from JSON string
            User.getUser(custom).getUserData('cookbook') //queue up the custom display after user data loads
                .then((cookbook)=>
                {
                    // alert(JSON.stringify(cookbook[recipeName]))
                    var customRecipe = cookbook[recipeName];
                    if(customRecipe){
                        callback(JSON.parse(customRecipe))
                    } else {
                        this.receiveRecipe({status:false,payload:recipeName+' not found in cookbook!'},callback)
                    }
                })
                //verification failed, user data failed to load, or invalid recipe name --> pass the error object we get
                .catch((message)=>this.receiveRecipe({status:false,payload:message.toString()},callback)) 
        } else {
            this.client.getDBItems('Recipes','Name',[recipeName],e => this.receiveRecipe(e,callback))
        }
    }

    loadRecipeBatch(batch,success,failure){
        this.client.getDBItems('Recipes','Name',batch,
            (response)=>{
                if(response.status){
                    success(response.payload.map((recipe)=>this.client.unpackItem(recipe,RecipeHelper.RecipePrototype)))
                } else {
                    console.error(response.payload)
                    failure(response.payload)
                }
            })
    }

    receiveRecipe(response,callback) {
        if(!response.status){
            //the call failed, should we try again?
            callback(null,response.payload)
            return
        }

        callback(this.client.unpackItem(response.payload[0],RecipeHelper.RecipePrototype))
    }




 }

RecipeHelper.getAvgRating = function(recipe){
    if(!recipe.Reviews){
        return 0;
    }
    let reviews = Object.entries(recipe.Reviews).map((review)=>review[1]);
    return reviews.reduce((prev,next)=>prev+next.Rating,0)/reviews.length;
}

RecipeHelper.getPrepTime = function(recipe){
    if(!recipe.TimeCost ||recipe.TimeCost==='Undefined'){
        return 360000;//600 hours to force these results to the bottom
    }
    let total = 0, tokens = recipe.TimeCost.split(/\s+/); //tokenize the string for parsing
    //do nothing unless the previous token was a time unit specifier
    tokens.reverse().reduce((prev,next)=>{total+=(prev==='m'?+next:(prev==='h'?+next*60:0));return next},0)
    return total;
}

 RecipeHelper.RecipeReferencePrototype = {
    _NAME:'RECIPE_REFERENCE',
    Name:{type:'S'},
    Importance:{type:'N'}
 }
DBClient.getClient().registerPrototype(RecipeHelper.RecipeReferencePrototype)

 RecipeHelper.IngredientPrototype = {
    _NAME:'INGREDIENT_BASE',
    Name:{type:'S'},
    recipes:{type:'L',inner:{'type':RecipeHelper.RecipeReferencePrototype._NAME}}
 }
DBClient.getClient().registerPrototype(RecipeHelper.IngredientPrototype)

 RecipeHelper.ReviewPrototype = {
    _NAME:'REVIEW',
    username:{type:'S'},
    Comment:{type:'S'},
    Rating:{type:'N'},
    timestamp:{type:'N'}
 }
DBClient.getClient().registerPrototype(RecipeHelper.ReviewPrototype)

 RecipeHelper.RecipePrototype = {
    _NAME:'RECIPE',
    Name:{type:'S'},
    Ingredients:{type:'L',inner:{type:'S'}},
    Directions:{type:'L',inner:{type:'S'}},
    Reviews:{type:'M',inner:{type:RecipeHelper.ReviewPrototype._NAME}},
    Author:{type:'S'},
    Difficulty:{type:'S'},
    TimeCost:{type:'S'}
 }
DBClient.getClient().registerPrototype(RecipeHelper.RecipePrototype)


 export default RecipeHelper;