import './website.html';
import { find } from 'highcharts';


const PRODUCT_HIGHLIGHTS = "products.highlights";
const PRODUCT_MENUS = "products.menus";
const WEB = "website.public";

Template.Website_public.onCreated(function () {

});


Template.Website_public.onRendered(function () {
    $("#__blaze-root").css("overflow-x", "hidden");

    var endpoint = FlowRouter.getParam("endpoint");

    Meteor.call("websites.public", endpoint, (error, data) => {
        if (data) {
            Session.set(WEB, data);
            document.title = data.title;
            setTimeout(function () {
                $('.centernonloop').owlCarousel({
                    center: true,
                    items: 1,
                    loop: false,
                    margin: 10,
                    dots: false,
                    responsive: {
                        350: {
                            items: 1.2
                        },
                        600: {
                            items: 3
                        },
                        800: {
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
            }, 600);

            /* $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) {
                //console.log(data);
                Meteor.call("website.analytics.register", endpoint, Session.get("fingerprint"), data);
            }); */
            Meteor.call("website.analytics.register", endpoint, Session.get("fingerprint"), {});
        } else {

        }
    });


    // RESTYLE THE DROPDOWN MENU
    $('#google_translate_element').on("click", function () {

        // Change font family and color
        $("iframe").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *")
            .css({
                'color': '#544F4B',
                'font-family': 'Roboto',
                'width': '100%'
            });
        // Change menu's padding
        $("iframe").contents().find('.goog-te-menu2-item-selected').css('display', 'none');

        // Change menu's padding
        $("iframe").contents().find('.goog-te-menu2').css('padding', '0px');

        // Change the padding of the languages
        $("iframe").contents().find('.goog-te-menu2-item div').css('padding', '20px');

        // Change the width of the languages
        $("iframe").contents().find('.goog-te-menu2-item').css('width', '100%');
        $("iframe").contents().find('td').css('width', '100%');

        // Change hover effects
        $("iframe").contents().find(".goog-te-menu2-item div").hover(function () {
            $(this).css('background-color', '#4385F5').find('span.text').css('color', 'white');
        }, function () {
            $(this).css('background-color', 'white').find('span.text').css('color', '#544F4B');
        });

        // Change Google's default blue border
        $("iframe").contents().find('.goog-te-menu2').css('border', 'none');

        // Change the iframe's box shadow
        $(".goog-te-menu-frame").css('box-shadow', '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3)');



        // Change the iframe's size and position?
        $(".goog-te-menu-frame").css({
            'height': '100%',
            'width': '100%',
            'top': '0px'
        });
        // Change iframes's size
        $("iframe").contents().find('.goog-te-menu2').css({
            'height': '100%',
            'width': '100%'
        });
    });

});

Template.Website_public.events({
    'click .js-clear-translate': function () {
        $("iframe").contents().find('.goog-close-link').click();
    }
});

Template.Website_public.helpers({
    'web': function () {
        return Session.get(WEB);
    },
    'get_img': function (id, key) {
        return fileUrl(id, "thumb");
    },
    'get_cover': function () {
        let web = Websites.findOne();

        if (web) {
            let file = Files.findOne({ _id: web.cover });
            if (file) {
                return fileUrl(file._id, "main");
            }

        }
    },
    'get_logo': function () {
        let web = Websites.findOne();

        if (web) {
            let file = Files.findOne({ _id: web.logo });
            if (file) {
                return fileUrl(file._id, "main");
            }

        }
    },
    'get_lang': function (lang) {
        return lang == "pt";
    }

});