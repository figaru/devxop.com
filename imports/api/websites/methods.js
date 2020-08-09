// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { compareSync } from 'bcrypt';

import '../../ui/utils/files';

Meteor.methods({
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

        if(web){

            //GETS HIGHLIGHTS
            let hightlights = Collections.findOne({"_id": web.highlights[0]});
            if(hightlights){
                hightlights.products = Products.find({_id: {$in: hightlights.products}}).fetch();

                for(let z = 0; z < hightlights.products.length; z++){
                    let product = hightlights.products[z];
                    hightlights.products[z].img = fileUrl(product.img, "main");
                }

                res.highlights = hightlights;                
            }

            //GET MENUS COLLECTIONS AND DATA
            let menus = Collections.find({"_id": {$in: web.menu} }).fetch();
            let finalMenu = [];
            if(menus){
                
                for(let i = 0; i < menus.length; i++){
                    let menuCollection = menus[i];

                    menuCollection.products = Products.find({_id: {$in: menuCollection.products}}).fetch();

                    for(let z = 0; z < menuCollection.products.length; z++){
                        
                        let product = menuCollection.products[z];
                        menuCollection.products[z].img = fileUrl(product.img, "main");

                        if(z == 0){
                            //set a collection image from first produtc
                            menuCollection["img"] = menuCollection.products[z].img;
                        }
                    }
                    finalMenu.push(menuCollection);
                    
                }
                menus.products = Products.find({_id: {$in: hightlights.products}}).fetch();
                res.highlights = hightlights;
                res.menu = finalMenu;
                
            }

            //GET IMAGES FOR OTHER ITEMS
            //[web.content_about_img, web.testimonial_img, web.logo, web.cover];
            res.content_about_img = fileUrl(web.content_about_img, "main");
            res.testimonial_img = fileUrl(web.testimonial_img, "main");
            res.logo = fileUrl(web.logo, "main");
            res.cover = fileUrl(web.cover, "main");

            return res;

        }

    }
});
