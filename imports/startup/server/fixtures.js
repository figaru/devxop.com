// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // if the Links collection is empty

  /* var companyId = Companies.insert({
    name: 'Portuguese Lab',
    createDate: new Date(),
    active: true
  });

  //Create users
  //Daniel
  userId = Accounts.createUser({
    email: 'lab@demo.com',
    password: '123',
    profile: {
      username: 'lab',
      firstName: 'Portuguese',
      lastName: 'Lab',
      company: companyId
    }
  });

  console.log(userId); */

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
