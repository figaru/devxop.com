import './landing.html';

//bg-white border-bottom shadow-sm

Template.Landing.onRendered(function(){

    let self = this;
    $(window).on('scroll', function() {
        var top = $(window).scrollTop();

        if(top > 0){
            self.$("#landing-header").addClass("scrolling");
        }else{
            self.$("#landing-header").removeClass("scrolling");
        }
    });
});

Template.Landing.onDestroyed(function(){
    //remove duplicate events
    $(window).unbind("scroll");
});