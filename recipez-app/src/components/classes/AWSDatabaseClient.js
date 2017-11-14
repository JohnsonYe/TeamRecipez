/**
 * Title: AWSDatabaseClient.js
 * Author: Alexander Haggart
 * Date Created: 11/7/2017
 * Description: This file will serve as the database access client
 */
 import AWS from 'aws-sdk';

 /**
  * THIS IS A SINGLETON CLASS.
  * DONT MAKE NEW DBCLIENT OBJECTS. USE THE STATIC METHOD DBClient.getClient() to retrieve a common instance
  */

var creds = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-2:7da319d0-f8c8-4c61-8c2a-789a751341aa',
});
AWS.config.update({region:'us-east-2',credentials:creds});
var db = new AWS.DynamoDB();

 class DBClient {
    constructor(){
        this.getDBItems = this.getDBItems.bind(this);
        this.buildBatchRequest = this.buildBatchRequest.bind(this);
        this.login = this.login.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.user = 'user001' //use this to test until authentication / user creation are ready

        this.authenticated = false
    }

    /*
     * Retrieve an object containing database items matching the given key list
     * the retrieved object will be sent to the given 'target' function handle
     * and marked as successful or unsuccessful
     *
     * string tableName: name of the table to retrieve items from
     * [string] keys: list of ingredient names to use as DB keys
     * handle target: function handle to send items to
     */
    getDBItems(tableName,keys,target){
        db.batchGetItem(this.buildBatchRequest(tableName,keys),function(err,data){
            if(err){
                target({status:false, payload: err});
            } else {
                target({status:true,  payload: data.Responses[tableName]});
            }
        })
    }

    /*
     * Construct an SQS object to retrieve a list of keys from a table
     * 
     * string tableName: name of table to retrieve keys from 
     * [string] keys: DB keys to retrieve
     *
     * return: JSON object set up as SQS query
     */
    buildBatchRequest(tableName,keys) {
        var keyList = keys.map(key => ({Name:{S: key }}));
        // alert(JSON.stringify(keyList))
        return { RequestItems:{ [tableName]:{ Keys: keyList }}}
    }

    updateItem(params,target){
        db.updateItem(params,this.pushResponseToHandle(target))

    }

    pushResponseToHandle(target){
        return (function(err,data){
            if(err){
                target({status:false, payload: err});
            } else {
                target({status:true,  payload: data});
            }
        })
    }

    buildMapUpdateExpression(mapName,key,value){
        return {expr: 'SET #map.' + key + ' = :item',
                names:{"#map":mapName},
                values:{":item":value}
            }
    }


    buildUpdateRequest(tableName,keyField,key,updateExpression){
        return {"UpdateExpression": updateExpression.expr,
                "ExpressionAttributeNames":updateExpression.names,
                "ExpressionAttributeValues":updateExpression.values,
                "TableName":tableName,
                "Key":{[keyField]:{S:key}}
            }

    }

    /*
     * log the user in to allow them to upload to DB and view user-specific data
     */
    login(username,password) {
        this.user = username
        return this.authenticated = true
    }

    isLoggedIn(){
        return this.authenticated
    }

    getUsername(){
        return this.user
    }

    unpackFormatting(aws_response) {

    }

 }

 var static_client = new DBClient();

 DBClient.getClient = () => static_client;

 export default DBClient;