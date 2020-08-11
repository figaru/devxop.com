// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { compareSync } from 'bcrypt';

import '../../ui/utils/files';


const webpush = require('web-push');

// VAPID keys should only be generated only once.
const vapidKeys = {
    publicKey: "BA477LIzpRITyZ83BaNVX5mjUOiNok2p0Kt9k7elV8sjmtro_kfwpcdVcD5JxVEGNyW5-P1QRny2n-K4GGodSi0",
    privateKey: "XShFUo4EmT3Rct5b6piiVs75_kjpXzQqiVgg2qxIlZg"
}//webpush.generateVAPIDKeys();

webpush.setGCMAPIKey('AIzaSyBAwc9rEdjtOfYBQy3jnoKtBD58R4K_3no');
webpush.setVapidDetails(
    'https://devxop.com/',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

Meteor.methods({
    'website.notifications.validate': function (data) {

        let sub = WebsitesPush.findOne(data);

        if (!sub) {
            return;
        } else {
            return sub;
        }
    },
    'website.notifications.subscribe': function (endpoint, data) {

        let website = Websites.findOne({ "endpoint": endpoint });

        if (website) {
            data["website"] = website._id;

            let exists = WebsitesPush.findOne({ "fingerprint_user": data.fingerprint_user, "website": website._id });

            if (exists) {
                WebsitesPush.remove(exists._id);
            }

            return WebsitesPush.insert(data);
        }

    },
    'website.notifications.unsubscribe': function (data) {

    },
    'website.notifications.notify': function (websiteId, title, text) {
        let website = Websites.findOne(websiteId);

        

        if (website) {

            let logo = fileUrl(website.logo, "thumb");

            let notifications = WebsitesPush.find({ website: websiteId }).fetch();
            for (let i = 0; i < notifications.length; i++) {
                //console.log(notifications[i]);

                let data = {
                    title: title,
                    text: text,
                    link: "https://devxop.com/app/" + website.endpoint,
                    icon: logo,
                    badge: logo
                }

                let final = JSON.stringify(data);

                webpush.sendNotification(JSON.parse(notifications[i].payload), final);
            }
        }


    },
    'website.exists': function () {
        let exists = Websites.find({ "user_id": this.userId }).count();
        if (!exists) {
            Websites.insert({
                user_id: this.userId,
                endpoint: "",
                highlights: [],
                menu: [],
            });
        }

    },
    'websites.public': function (endpoint) {
        let web = Websites.findOne({ "endpoint": endpoint });

        let res = web;

        if (web) {

            //GETS HIGHLIGHTS
            let hightlights = Collections.findOne({ "_id": web.highlights[0] });
            if (hightlights) {
                hightlights.products = Products.find({ _id: { $in: hightlights.products } }).fetch();

                for (let z = 0; z < hightlights.products.length; z++) {
                    let product = hightlights.products[z];
                    hightlights.products[z].img = fileUrl(product.img, "thumb");
                }

                res.highlights = hightlights;
            }

            //GET MENUS COLLECTIONS AND DATA
            let menus = Collections.find({ "_id": { $in: web.menu } }).fetch();
            let finalMenu = [];
            if (menus) {

                for (let i = 0; i < menus.length; i++) {
                    let menuCollection = menus[i];

                    menuCollection.products = Products.find({ _id: { $in: menuCollection.products } }).fetch();

                    for (let z = 0; z < menuCollection.products.length; z++) {

                        let product = menuCollection.products[z];
                        menuCollection.products[z].img = fileUrl(product.img, "thumb");

                        if (z == 0) {
                            //set a collection image from first produtc
                            menuCollection["img"] = menuCollection.products[z].img;
                        }
                    }
                    finalMenu.push(menuCollection);

                }
                menus.products = Products.find({ _id: { $in: hightlights.products } }).fetch();
                res.highlights = hightlights;
                res.menu = finalMenu;

            }

            //GET IMAGES FOR OTHER ITEMS
            //[web.content_about_img, web.testimonial_img, web.logo, web.cover];
            res.content_about_img = fileUrl(web.content_about_img, "thumb");
            res.testimonial_img = fileUrl(web.testimonial_img, "thumb");
            res.logo = fileUrl(web.logo, "main");
            res.cover = fileUrl(web.cover, "main");

            return res;

        }

    }
});
