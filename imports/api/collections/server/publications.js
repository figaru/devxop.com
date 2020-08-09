// All links-related publications

import { Meteor } from 'meteor/meteor';

Meteor.publish('collections.all', function () {
  return Collections.find({"user_id": this.userId});
});


Meteor.publish('collections.menu', function (collectionsArray) {
  //console.log(Collections.find({"_id": { "$in": collectionsArray }}).count());
  return Collections.find({"_id": { "$in": collectionsArray }});
});
