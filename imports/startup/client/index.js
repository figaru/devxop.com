// Import client startup through a single index entry point
import '../../ui/layouts/index';
import '../../ui/pages/index';
import '../../ui/components/index';
import '../../ui/utils/index';

import './routes/index.js';


import WayPoint from '../../ui/vendors/js/jquery.waypoints.min.js';
import Carousel from '../../ui/vendors/js/owl.carousel.min.js';

import QRCode from 'qrcode-generator'

$(document).ready(function () {
    window["WayPoint"] = WayPoint;
    window["owlCarousel"] = Carousel;
    window["qrCode"] = QRCode;

});





