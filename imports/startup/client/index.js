// Import client startup through a single index entry point
import '../../ui/layouts/index';
import '../../ui/pages/index';
import '../../ui/components/index';
import '../../ui/utils/index';

import './routes/index.js';


import WayPoint from '/imports/ui/vendor/js/jquery.waypoints.min.js';
import Carousel from '/imports/ui/vendor/js/owl.carousel.min.js';

$(document).ready(function () {
    window["WayPoint"] = WayPoint;
    window["owlCarousel"] = Carousel;

});





