// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    'website.exists': function () {
        let exists = Websites.find({"user_id": this.userId}).count();
        if(!exists){
            Websites.insert({
                user_id: this.userId,
                endpoint: "",
                highlights: [],
                menu: [],
            });
        }

    }
});
