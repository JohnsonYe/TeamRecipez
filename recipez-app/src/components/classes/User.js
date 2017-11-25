/*
 * title: user.js
 * Author: Alexander Haggart
 * Date Created: 11/8/17
 * Description: This file will handle user data operations through the DBClient
 */
 import DBClient from './AWSDatabaseClient'

 /**
  * SINGLETON CLASS --> USE User.getUser() to get the shared instance
  */

 class User {
    constructor(){
        this.client = DBClient.getClient()
        this.client.registerPrototype(User.PantryItemPrototype)
        this.loadUserData = this.loadUserData.bind(this);
        this.verify = this.verify.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.getUserData = this.getUserData.bind(this);

        this.getPantry = this.getPantry.bind(this);
        this.addToPantry = this.addToPantry.bind(this);
        this.removeFromPantry = this.removeFromPantry.bind(this);

        // this.addToPantry('zucchini','none',1)
        // this.removeFromPantry('zucchini')

        this.userData = { username:this.client.getUsername(), cookbook:{},cookware:{},pantry:{},planner:{}}

        // this.client.updateItem(
        //     this.client.buildUpdateRequest(
        //         'User',
        //         'username',this.client.getUsername(),
        //         this.client.buildSetUpdateExpression('cookbook',{SS:["Good Old Fashioned Pancakes","Banana Banana Bread","The Best Rolled Sugar Cookies","To Die For Blueberry Muffins","Award Winning Soft Chocolate Chip Cookies"]})),
        //     this.client.alertResponseCallback)
        this.loadStream = new Promise(this.loadUserData)
        this.verified = false;
    }

    /**
     * this.userData:
     * {
     *      username: <String> username associated with this object, also the primary key for the User table
     *      pantry:   <Map<String,Object>> user's ingredient pantry and associated metadata
     *      cookbook: <Set<String>> user's favorited/saved recipe list
     *      cookware: <Set<String>> user's available cookware
     *      planner:  <???> TODO work with planner team on data organization
     * }
     */
    loadUserData(resolve,reject){
        if(this.userData.username === DBClient.UNAUTH_NAME){ //skip loading if the user is not signed in
            // alert('rejected!')
            reject('User is not logged in!')
            return
        }
        this.client.getDBItems('User','username',[this.client.getUsername()],(response)=>{
            if(response.status){
                this.userData = {
                    username:   response.payload[0].username.S,
                    cookbook:   response.payload[0].cookbook.M,
                    cookware:   new Set(response.payload[0].cookware.SS),
                    pantry:     this.client.unpackMap(response.payload[0].pantry.M),
                    planner:{}
                }
                // alert(JSON.stringify(this.client.unpackItem(response.payload[0],User.UserDataPrototype)))
                resolve(this.client.unpackItem(response.payload[0],User.UserDataPrototype))
                // resolve(this.userData)
            } else {
                this.userData = null
                // alert('rejected!')
                reject('Failed to load user data!')
            }
            /*; alert(JSON.stringify(this.userData))*/})
    }

    deleteRecipe(recipeName){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('cookbook',recipeName)),
            (response)=>{
                if(response.status){
                    this.addUserData((data)=>{
                        delete data.cookbook[recipeName];
                        return data
                    })
                } else {
                    //the request failed, what should we do?
                    alert(response.payload)
                }
            })
    }


    saveCustomRecipe(recipeObject){
        //pack the recipe into JSON format and add it to the user's recipe map
        this.client.updateItem( //basic update request, expects a complicated syntax that we build below 
            this.client.buildUpdateRequest( //construct the params syntax according to the action we want
                'User', //table to get item from
                'username',this.client.getUsername(), //keyfield and specific key
                //set cookbook[recipeObject.Name] = (data)
                this.client.buildMapUpdateExpression('cookbook',recipeObject.Name,{S:JSON.stringify(recipeObject)})), 
            (response)=>{ //if the request succeeds, 'add' to the local use data by transforming it in a then clause
                if(response.status){
                    this.addUserData((data)=>{
                        data.cookbook[recipeObject.Name]=JSON.stringify(recipeObject);
                        return data;
                    })
                } else {
                    //the request failed, what should we do?
                    alert(response.payload)
                }
            })
    }

    saveExternalRecipe(recipeName){
        //save just the recipe name to the cookbook so we know to load it froma public recipe page
        this.client.updateItem( //basic update request, expects a complicated syntax that we build below 
            this.client.buildUpdateRequest( //construct the params syntax according to the action we want
                'User', //table to get item from
                'username',this.client.getUsername(), //keyfield and specific key
                //set cookbook[recipeName] = 'none'
                this.client.buildMapUpdateExpression('cookbook',recipeName,{S:'none'})), 
            (response)=>{ //if the request succeeds, 'add' to the local user data by transforming it in a then clause
                if(response.status){
                    this.addUserData((data)=>{
                        data.cookbook[recipeName]='none';
                        return data;
                    })
                } else {
                    //the request failed, what should we do?
                    alert(response.payload)
                }
            })
    }

    /**
     * get a Pantry Object:
     * {
     *      [Ingredient]:
     *      {
     *          amount: amout of this ingredient
     *          unit: unit of ingredient amount
     *      }
     * }
     */
    getPantry(callback){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
         this.getUserData('pantry').then(callback)
    }

    addToPantry(ingredient,unit,amount){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',this.client.getUsername(),
                this.client.buildMapUpdateExpression('pantry',ingredient,{M:{amount:{N:amount.toString()},unit:{S:unit}}})),
            function(response){if(response.status) this.userData.pantry[ingredient] = {amount:amount,unit:unit}}.bind(this))

    }

    removeFromPantry(ingredient){
        this.client.updateItem(
            this.client.buildUpdateDeleteRequest(
                'User',
                'username',this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('pantry',ingredient)),
            function(response){if(response.status&&this.userData.pantry[ingredient]) delete this.userData.pantry[ingredient]}.bind(this))
    }

    getCookbook(callback){
        this.getUserData('cookbook').then(callback)
    }

    getCookware(callback){
        this.getUserData('cookware').then(callback)
    }

    getPlanner(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
        return {Monday:['cook'],Tuesday:['eat'],Wednesday:['sleep'],Thursday:['grocery shopping']}
    }

    getNotes(){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
         return {"Good Old Fashioned Pancakes":
                    {target:{type:'ingredient',id:'blueberry'},
                    text:'use frozen blueberries for that dank artifical taste'}}

    }

    /**
     * return a Promise that will provide the user data chain and automatically index into the specified field
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getUserData(name){
        return this.loadStream.then((data)=>data[name]).catch((e)=>'Failed to fetch loaded data!');
    }

    /**
     * apply a function to the user data chain before serving it to future requests
     */
    addUserData(transform){
        this.loadStream = this.loadStream.then(transform);
    }

    /**
     * add a verification link to the user data chain, which will fail if validation fails
     * @param  String username the username associated with the requested data
     * @return User          the User object we are verifying
     */
    verify(username){
        if(!this.verified){
            this.loadStream = this.loadStream.then((data)=>this.validateUsername(username,data));
            this.verified = true;
        }
        return this
    }

    validateUsername(username,userData){
        if(username === userData.username){
            return userData
        } else {
            throw new Error('You don\'t have permission to view '+username+'\'s personal data.')
        }
    }
 }

 User.PantryItemPrototype = {
    _NAME:'PANTRYITEM',
    amount:{type:'N'},
    unit:{type:'S'}
 }

 User.UserDataPrototype = {
    _NAME:'USERDATA',
    username:{type:'S'},
    cookbook:{type:'M',inner:{type:'S'}},
    cookware:{type:'SS',inner:{type:'SET'}},
    pantry:{type:'M',inner:{type:User.PantryItemPrototype._NAME}},
    planner:{}
 }


 var static_user = new User();

 User.getUser = (username) => static_user.verify(username);

 export default User;