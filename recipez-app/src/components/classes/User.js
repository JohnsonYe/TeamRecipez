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

  // Trying to create new branch - Morten

 class User {
    constructor(){
        this.client = DBClient.getClient()
        this.client.registerPrototype('PANTRYITEM',User.PantryItemPrototype)
        this.loadUserData = this.loadUserData.bind(this);
        this.verify = this.verify.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.getUserData = this.getUserData.bind(this);

        this.getPantry = this.getPantry.bind(this);
        this.addToPantry = this.addToPantry.bind(this);
        this.removeFromPantry = this.removeFromPantry.bind(this);

        this.mort = "Morten Knapp";

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
    }

    getMort(){
        return this.client.getUsername;
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
                    exclude:    new Set(response.payload[0].cookware.SS),
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
         //return this.getUserData('pantry').then(response=>{alert(JSON.stringify(response));callback(response)})    ---  This works as well + gives us a worning.

         return this.getUserData('pantry').then(response=>{callback(response)})

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
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
        return this.getUserData('cookbook').then(response=>{alert(JSON.stringify(response));callback(response)})
        //return this.userData.cookbook
         // return new Set(["Good Old Fashioned Pancakes","Banana Banana Bread","The Best Rolled Sugar Cookies",
         //            "To Die For Blueberry Muffins","Award Winning Soft Chocolate Chip Cookies"])
    }

    addToCookbook(recipe, info){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildMapUpdateExpression('cookbook', recipe, {S:info})),
            function(response){if(response.status) this.userData.cookbook[recipe] = {info:info}}.bind(this))
    }

    removeFromCookbook(recipe){
        this.client.updateItem(
            this.client.buildUpdateDeleteRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('cookbook', recipe)),
            function(response){if(response.status&&this.userData[recipe]) delete this.userData[recipe]; else(JSON.stringify(response))}.bind(this))
    }



    getCookware(callback){
        /*
         * What should this object look like? We need to decide on formatting/nesting of data
         */
        return this.getUserData('cookware').then(response=>{alert(JSON.stringify(response));callback(response)})
        //return [{Name:'spoon',difficulty:1},{Name:'whisk',difficulty:2},{Name:'food processor',difficulty:8}]
    }

    addToCookware(item){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildStringSetAppendUpdateExpression('cookware', {SS:[item]})),
            function(response){if(response.status) this.userData.cookware[item] = {item:item}; else alert(JSON.stringify(response))}.bind(this))
    }

    removeFromCookware(item){
        this.client.updateItem(
            this.client.buildUpdateDeleteRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('cookware', item)),
            function(response){if(response.status&&this.userData.cookware[item]) delete this.userData.cookware[item]; else alert(JSON.stringify(response))}.bind(this))
    }


    addToExclusionList(ingredient){
        this.client.updateItem(
            this.client.buildUpdateRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildStringSetAppendUpdateExpression('exclude', {SS:[ingredient]})),
            function(response){if(response.status) this.userData.exclude[ingredient] = {ingredient:ingredient}; else alert(JSON.stringify(response)) }.bind(this))
    }

    removeFromExclusionList(ingredient){
        this.client.updateItem(
            this.client.buildUpdateDeleteRequest(
                'User',
                'username',
                this.client.getUsername(),
                this.client.buildRemoveElementUpdateExpression('exclude', ingredient)),
            function(response){if(response.status&&this.userData[ingredient]) delete this.userData[ingredient]; else alert(JSON.stringify(response)) }.bind(this))
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

    getUserData(name){
        if(!this.userData || !this.userData[name]){
            return new Promise().reject('Could not fetch user data');
        } else {
            return this.loadStream.then((data)=>data[name]);
        }
    }

    verify(username){
        this.loadStream = this.loadStream.then((data)=>this.validateUsername(username,data))
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

                //  this.userData = {
                //     username:   response.payload[0].username.S,
                //     cookbook:   response.payload[0].cookbook.M,
                //     cookware:   new Set(response.payload[0].cookware.SS),
                //     pantry:     this.client.unpackMap(response.payload[0].pantry.M),
                //     planner:{}
                // }

 User.UserDataPrototype = {
    username:{type:'S'},
    cookbook:{type:'M',inner:{type:'S'}},
    cookware:{type:'SS',inner:{type:'SET'}},
    pantry:{type:'M',inner:{type:'PANTRYITEM'}},
    planner:{}
 }

 User.PantryItemPrototype = {
    amount:{type:'N'},
    unit:{type:'S'}
 }

 var static_user = new User();

 User.getUser = (username) => static_user.verify(username);

 export default User;