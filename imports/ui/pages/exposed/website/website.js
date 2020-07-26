import './website.html';
import { find } from 'highcharts';

Template.Website_public.onCreated(function () {
    let self = this;



    self.autorun(function () {

        let web = Websites.findOne();

        if (web) {

            let collectionsArray = web.menu.concat(web.highlights);
            let collections = self.subscribe("collections.menu", collectionsArray);
            // if subscription is ready, set limit to newLimit
            if (collections.ready()) {
                console.log("> Received collections. \n\n");
                let productsArray = [];
                Collections.find().fetch().forEach(collection => {
                    productsArray = productsArray.concat(collection.products);
                });
                let products = self.subscribe("products.find", productsArray);

                if (products.ready()) {
                    console.log("> Received products. \n\n");

                    let filesArray = [web.logo, web.cover];
                    Products.find().fetch().forEach(product => {
                        //get product image
                        filesArray.push(product.img);
                    });

                    let files = self.subscribe("files.find", filesArray);

                    if (files.ready()) {
                        console.log("> Received files. \n\n");
                    }
                }
            }
        }

    });

    self.collections = function () {
        return Collections.find({});
    }
});

Template.Website_public.onRendered(function(){
    $('.centernonloop').owlCarousel({
        center: true,
        items: 1,
        loop: false,
        margin: 10,
        dots: true,
        responsive: {
            300: {
                items: 2
            },
            600: {
                items: 4
            }
        }
    });


    var i = 0;
    $('.element-animate').waypoint(function (direction) {
        if (direction === 'down' && !$(this.element).hasClass('element-animated')) {

            i++;

            $(this.element).addClass('item-animate');
            setTimeout(function () {

                $('body .element-animate.item-animate').each(function (k) {
                    var el = $(this);
                    setTimeout(function () {
                        var effect = el.data('animate-effect');
                        if (effect === 'fadeIn') {
                            el.addClass('fadeIn element-animated');
                        } else if (effect === 'fadeInLeft') {
                            el.addClass('fadeInLeft element-animated');
                        } else if (effect === 'fadeInRight') {
                            el.addClass('fadeInRight element-animated');
                        } else {
                            el.addClass('fadeInUp element-animated');
                        }
                        el.removeClass('item-animate');
                    }, k * 100);
                });

            }, 100);

        }

    }, { offset: '95%' });
});

Template.Website_public.helpers({
    'get_cover': function(){
        let web = Websites.findOne();
        
        if(web){
            let file = Files.findOne({_id: web.cover});
            if(file){
                return fileUrl(file._id, "main");
            }
            
        }
    },
    'get_lang': function(lang){
        return lang == "pt";
    },
    'highlights': function(){
        let web = Websites.findOne();
        
        if(web){
            let collection = Collections.findOne({_id: {$in: web.highlights}});

            if(collection){

                let products = Products.find({_id: {$in: collection.products}}).fetch();

                return products;
            }
        }
            

        return null;
    }

});