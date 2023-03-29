(function ($) {
    $.fn.autoScroll = function (options) {
        var actualHeight = 0;
        var canScroll = true;
        var maxPosition = 0;

        var settings = $.extend({
            containerSelector: ".section-scroll",
            navigation: true
        }, options);

        /* Get Selectors */
        var arraySelectors = [];
        $(settings.containerSelector).each(function () {
            arraySelectors.push($(this));
        });

        /* Set Attributes to Elements */
        getElementHeight(arraySelectors);
        function getElementHeight(arraySelectors) {
            var loopCounter = 0;
            $(arraySelectors).each(function () {
                $(this).attr("data-height", $(this).height()).attr("data-position", loopCounter);
                //alert($(this).height());
                loopCounter++;
            });
        }

        if (settings.navigation) {
            var navigation = "<div id='autoscroll-navigation'>";
            $(arraySelectors).each(function () {
                var elementPosition = $(this).attr("data-position");
                if (elementPosition == 0) {
                    var activePosition = " active ";
                } else {
                    var activePosition = "";
                }
                navigation += "<span class='" + activePosition + "' data-position='" + elementPosition + "' onclick='autoScroll.scrollToElement(" + elementPosition + ")'></span>"
                activePosition = false;
                maxPosition = elementPosition;
            });
            navigation += "</div>";
            $("body").append(navigation);

        }
        setActiveElement();
        /* Set Active Element */
        function setActiveElement() {
            var minDistance = 1000000;
            var activeSelector = "";
            $(arraySelectors).each(function () {
                var distance = ($(this).offset().top - $(window).scrollTop());
                if (distance < 0) {
                    distance = distance * -1;
                }
                if (distance < minDistance) {
                    minDistance = distance;
                    activeSelector = $(this);
                }
            });

            $(settings.containerSelector).removeClass("active");
            $(settings.containerSelector).attr("data-active", "false");
            activeSelector.addClass("active");
            activeSelector.attr("data-active", "true");
            if (settings.navigation) {
                $("#autoscroll-navigation span").removeClass("active");
                $('#autoscroll-navigation span[data-position="' + activeSelector.attr("data-position") + '"]').addClass("active");
            }
        }

        function changeScrollDefault() {
            if (canScroll) {
                if (actualHeight > $(window).scrollTop()) {
                    scrollBeforeSection();
                } else {
                    scrollNextSection();
                }
            }
            actualHeight = $(window).scrollTop();
        }
        function scrollBeforeSection() {
            if (parseInt(getActiveElementPosition()) - 1 >= 0) {
                scrollToElement(parseInt(getActiveElementPosition()) - 1);
            }
        }
        function scrollNextSection() {
            if (parseInt(getActiveElementPosition()) + 1 <= maxPosition) {
                scrollToElement(parseInt(getActiveElementPosition()) + 1);
            }
        }

        /* Window Scroll */
        $(window).scroll(function () {
            setActiveElement();
            changeScrollDefault();
        });

        /* Window Resize */
        $(window).resize(function () {
            getElementHeight(arraySelectors);
        });

        /* Prevent # jump onclick */
        $("a.autoscroll-navItem").click(function (e) {
            e.preventDefault();
        });
        /* Methods */
        function scrollToElement(data) {

            if (canScroll) {
                canScroll = false;
                $("html, body").animate({ scrollTop: $('[data-position="' + data + '"]').offset().top }, 1000, function () {
                    canScroll = true;
                });
            }
        }
        function getActiveElementPosition() {
            var activeElement = $(settings.containerSelector + ".active").attr("data-position");
            return (activeElement)
        }

        return {
            scrollToElement: function (data) {
                scrollToElement(data);
            },
            getActiveElementPosition: function () {
                return getActiveElementPosition();
            }
        }
    };


}(jQuery));

// Scroll Up usage example:
var options = {
    containerSelector: '.section-scroll',
    navigation: 'true'
}
var autoScroll = $().autoScroll(options);

autoScroll.scrollToElement(1)