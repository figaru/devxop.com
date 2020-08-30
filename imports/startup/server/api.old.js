import { Random } from 'meteor/random'
import { type, param } from 'jquery';

import './api.helpers';
import '../../ui/utils/files';

module.exports = function (Router) {

    Router.get('/api/display', function (req, res, next) {
        let params = getParams(req);

        let device = Devices.findOne({ "device_id": params.device_id });

        if (device) {
            //console.log(device);
            Devices.update(device._id, {
                $set: {
                    "update": false,
                    "updated_stamp": new Date().getTime()
                }
            });

            if (device.system_force) {
                let data = {
                    display: "restart",
                    url: "",
                    code: ""
                    /* orientation: device.display_types[selected].orientation */
                };

                return resp(res, 200, data);
            }

            let data = {
                display: "",
                url: "",
                code: "",
                /* orientation: device.display_types[selected].orientation */
            };

            let publishedView = device.published_view;
            let views = device.views;
            switch (publishedView) {
                case "video":
                    // code block
                    if (typeof views.video.files != "undefined") {

                        let fileId = views.video.files[0];
                        let file = Files.findOne({ '_id': fileId });
                        if (file) {
                            let fileDownloadObject = fileUrlSmall(file._id, "video");

                            data.display = "video";
                            data.url = fileDownloadObject;
                        }

                    }
                    break;
                case "image":
                    // code block
                    if (typeof views.image.files != "undefined") {
                        let fileId = views.image.files[0];
                        let file = Files.findOne({ '_id': fileId });
                        if (file) {
                            let fileDownloadObject = fileUrlSmall(file._id, "main");
                            data.display = "image";
                            data.url = fileDownloadObject;
                        }

                    }
                    break;
                case "module":
                    // code block
                    if (typeof views.module.id != "undefined" && views.module.id) {
                        let moduleId = views.module.id;
                        //console.log(files);
                        let module = Modules.findOne({ '_id': moduleId });
                        if (module) {
                            let file = Files.findOne({ '_id': module.file });
                            if (file) {
                                let fileDownloadObject = fileUrlSmall(file._id, "main");

                                data.display = "image";
                                data.url = fileDownloadObject;
                            }

                        }
                    }
                    break;
            }
            /*             if (selected) {
                            if (selected == "static") {
                                let img = Images.findOne({ "_id": device.display_types[selected].image });
                                data.display = "image";
                                if (img) {
                                    let imgUrl = img.url();
                                    data.url = imgUrl;
                                }
                            } else if (selected == "video") {
                                let video = Videos.findOne({ "_id": device.display_types[selected].video });
                                data.display = "video";
                                if (video) {
                                    let videoUrl = video.url();
                                    data.url = videoUrl
                                }
                            } else if (selected == "code") {
                                data.display = "webview";
                                data.code = device.display_types[selected].code
            
                            } else if (selected == "template") {
                                let template = Templates.findOne({ "_id": device.display_types[selected].id });
                                if (template) {
                                    let img = Images.findOne({ "_id": template.image });
                                    data.display = "image";
                                    if (img) {
                                        let imgUrl = img.url();
                                        data.url = imgUrl;
                                    }
                                }
            
            
                            }
                        } */

            return resp(res, 200, data);


        } else {
            return resp(res, 400, "");
        }


    });

    Router.get('/api/device/update', function (req, res, next) {

        let params = getParams(req);

        let exists = Devices.findOne({ "device_id": params.device_id });

        if (exists) {
            Devices.update(exists._id, {
                $set: {
                    "ping_stamp": new Date().getTime()
                }
            });



            resp(res, 200, "" + exists.update);
        } else {
            resp(res, 200, null);
        }


    });


    Router.post('/api/device/register', function (req, res, next) {

        let params = getParams(req);

        let data = "hey";
        if ("user" in params && "pass" in params && "device_id" in params) {

            let user = Accounts.findUserByEmail(params.user);
            let result = Accounts._checkPassword(user, params.pass);

            if (result.error) {
                //invalid authentication attempt
                return resp(res, 500, null);
            } else {
                let device = {
                    device_id: params.device_id,
                    stamp: new Date().getTime(),
                    startup_stamp: new Date().getTime(),
                    user_id: user._id
                };


                let exists = Devices.findOne({ "device_id": params.device_id });

                if (!exists) {
                    Devices.insert(device);
                }

                return resp(res, 200, data);
            }
        } else {
            return resp(res, 500, null);
        }

    });


    Router.post('/api/device/sync', function (req, res, next) {

        let params = getParams(req);
        let exists = Devices.findOne({ "device_id": params.device_id });


        if (exists) {
            Devices.update(exists._id, {
                $set: {
                    "startup_stamp": new Date().getTime(),
                    "system_force": false
                }
            });
            return resp(res, 200, null);
        } else {
            return resp(res, 400, null);
        }


    });

    Router.get('/api/device/time', function (req, res, next) {

        let params = getParams(req);


        resp(res, 200, "" + new Date().getTime());

    });
};