// All links-related publications

import { Meteor } from 'meteor/meteor';

Meteor.publish('modules.all', function () {
  return Modules.find({"user_id": this.userId});
});
