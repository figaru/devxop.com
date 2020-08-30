
if (Meteor.isClient) {
    Template.registerHelper('getViewFiles', (device) => {
        if (device) {
            return device.views[device.published_view].files;
        }

        return [];

    });

    Template.registerHelper('fileUrl', (id, key) => { return fileUrl(id, key) });
}


fileUrl = function (id, key) {

    let file = Files.findOne({ "_id": id });

    if (!file) {
        return null;
    }

    let data = {
        url: Meteor.settings.public.api.storage + "/files/" + file.user_id + "/" + id
    }

    if (file.is_image) {
        data["type"] = "image";
        data["preload"] = data.url + "/preload." + file.extension;
        data["thumb"] = data.url + "/thumb." + file.extension;
        data["main"] = data.url + "/main." + file.extension;
    } else if (file.is_video) {
        data["type"] = "video";
        //data["preload"] = data.url + "/preload.png";
        data["thumb"] = data.url + "/thumb.png";
        data["preview"] = data.url + "/preview.gif";
        data["video"] = data.url + "/video." + file.extension;
    } else {
        data["type"] = "other";
        data["main"] = data.url + "/" + file.file.name;
    }

    //console.log(data[key]);

    if (key) {
        return data[key];
    }

    return data;
}

fileUrlSmall = function (id, key) {

    let file = Files.findOne({ "_id": id });

    if (!file) {
        return null;
    }

    let data = {
        url: ":5000/files/" + file.user_id + "/" + id
    }

    if (file.is_image) {
        data["type"] = "image";
        data["preload"] = data.url + "/preload." + file.extension;
        data["thumb"] = data.url + "/thumb." + file.extension;
        data["main"] = data.url + "/main." + file.extension;
    } else if (file.is_video) {
        data["type"] = "video";
        //data["preload"] = data.url + "/preload.png";
        data["thumb"] = data.url + "/thumb.png";
        data["preview"] = data.url + "/preview.gif";
        data["video"] = data.url + "/video." + file.extension;
    } else {
        data["type"] = "other";
        data["main"] = data.url + "/" + file.file.name;
    }

    //console.log(data[key]);

    if (key) {
        return data[key];
    }

    return data;
}