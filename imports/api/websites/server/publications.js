// All links-related publications

import { Meteor } from 'meteor/meteor';

Meteor.publish('websites.all', function () {
  return Websites.find({user_id: this.userId});
});


Meteor.publish('websites.getOne', function (endpoint) {
  return Websites.find({endpoint: endpoint});
});
