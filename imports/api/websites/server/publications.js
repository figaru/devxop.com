// All links-related publications

import { Meteor } from 'meteor/meteor';

Meteor.publish('websites.all', function () {
  return Websites.find({user_id: this.userId});
});

Meteor.publish('websites.push.all', function () {
  let web = Websites.findOne({user_id: this.userId});

  if(web){
    return WebsitesPush.find({website: web._id});
  }
  
  return null;
});


Meteor.publish('websites.getOne', function (endpoint) {
  return Websites.find({endpoint: endpoint});
});
