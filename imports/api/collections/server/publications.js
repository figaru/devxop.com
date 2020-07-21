// All links-related publications

import { Meteor } from 'meteor/meteor';

Meteor.publish('collections.all', function () {
  return Collections.find();
});
