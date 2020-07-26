import { Meteor } from 'meteor/meteor';
import '../files.js';

Meteor.publish('files.all', function () {
    //console.log(Files.find().fetch());
    //Files.insert({"name": "test_file"});
    return Files.find({ "user_id": this.userId });
});

Meteor.publish('files.allByType', function (type) {

    return Files.find({ "user_id": this.userId, "file.mimetype": { $regex: ".*" + type + ".*" } });
});


Meteor.publish('files.find', function (array) {
    //console.log(Collections.find({"_id": { "$in": collectionsArray }}).count());
    return Files.find({"_id": { "$in": array }});
  });
  


