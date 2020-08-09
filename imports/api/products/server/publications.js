// All links-related publications

import { Meteor } from 'meteor/meteor';

Meteor.publish('products.all', function () {
  return Products.find({"user_id": this.userId});
});


Meteor.publish('products.find', function (array) {
  //console.log(Collections.find({"_id": { "$in": collectionsArray }}).count());
  return Products.find({"_id": { "$in": array }});
});
