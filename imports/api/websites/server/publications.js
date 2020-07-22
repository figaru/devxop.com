// All links-related publications

import { Meteor } from 'meteor/meteor';

Meteor.publish('websites.all', function () {
  return Products.find();
});
