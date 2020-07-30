// Definition of the links collection

import { Mongo } from 'meteor/mongo';

Collections = new Mongo.Collection('collections');

Collections.allow({
    insert: function (userId, doc) {
        /*  Lets deny all client file inserts
            *all files inserted are now being handled by the db server, 
            wich will hadle and store a new file uploaded by the user. 
        */
        doc["user_id"] = userId;
        return true;
    },
    remove: function (userId, doc) {

        if (doc["user_id"] == userId) {
            return true;
        }

        return false;
    },
    update: function (userId, doc) {
        
        if (doc["user_id"] == userId) {
            return true;
        }

        return false;
    },
});
