// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Links } from '../../api/links/links.js';

Meteor.startup(() => {
  // if the Links collection is empty
  if (Companies.find().count() === 0) {
    console.log("no companies... creating one");
    //Create company
    var companyId = Companies.insert({
      name: 'GS Bistro',
      createDate: new Date(),
      active: true
    });

    //Create users
    //Daniel
    userId = Accounts.createUser({
      email: 'daniel@demo.com',
      password: '123',
      profile: {
        username: 'daniel',
        firstName: 'Daniel',
        lastName: 'Abrantes',
        company: companyId
      }
    });
  }
});
