(function ($) {

    "use strict";

    $.fn.boom = function (options) {

        $(this).each(function () {

            var lastPercent,
                settings = $.extend({
                    landingZone: 0.10
                }, options);


            //calculate and place things in the proper place
            var place = function () {
                var scrollTop       = $(window).scrollTop(),
                    top             = $(this).offset().top,
                    height          = $(this).height(),
                    windowHeight    = $(window).height(),
                    landingHeight   = settings.landingZone * windowHeight,
                    distance        = 0,
                    landingTop      = (windowHeight - landingHeight) / 2,
                    landingBottom   = windowHeight - landingTop,
                    y               = top - scrollTop,
                    y2              = y + height,
                    percent,
                    position        = 'above';


                if(y > landingBottom) {
                    distance = y - landingBottom;
                    percent = distance / (windowHeight - landingBottom);
                    position = 'bottom';
                } else if (y2 < landingTop) {
                    distance = landingTop - y2;
                    percent  = distance / landingTop;
                    position = 'top';
                } else {
                    percent = 0;
                    position = 'inside';
                }

                //clamp percent
                percent = Math.min(1, Math.max(0, percent));
                if (percent != lastPercent) {
                    placeImages(percent);
                    lastPercent = percent;
                }

            }.bind(this);

            function setScale (element, scale) {

                var transformString = ("scale(" + scale + ")");

                // now attach that variable to each prefixed style
                element.style.webkitTransform = transformString;
                element.style.MozTransform = transformString;
                element.style.msTransform = transformString;
                element.style.OTransform = transformString;
                element.style.transform = transformString;
            }


            var placeImages = function (percent) {


                $(this).find('img').each(function (idx) {

                    var startingPos = $(this).data('starting-pos'),
                        endingPos   = $(this).data('ending-pos'),
                        css         = {};


                    if (endingPos.left) {
                        css.left = endingPos.left * percent + startingPos.left;
                    }

                    if (endingPos.top) {
                        css.top = endingPos.top * percent + startingPos.top;
                    }

                    if (endingPos.scale) {
                        setScale($(this)[0], (endingPos.scale - 1) * percent + 1)
                    }

                    $(this).css(css);

                    console.log('placed images');

                });

                //console.log('placing at', percent);

            }.bind(this);

            //store starting position of all inner images
            $(this).find('img').each(function (idx) {

                var pos = $(this).position(),
                    start = JSON.parse($(this).attr('data-start'));

                $(this).data('starting-pos', pos).data('ending-pos', start);

            });




            setTimeout(function () {


                $(window).scroll(function(e) {
                    place();
                }.bind(this));

                place();

            }, 1500);



        });


        return this;

    };

}(jQuery));