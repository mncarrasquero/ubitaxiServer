(function($) {

    $.foursquareAutocomplete = function(element, options) {
        this.options = {};

        element.data('foursquareAutocomplete', this);

        this.init = function(element, options) {
            this.options = $.extend({}, $.foursquareAutocomplete.defaultOptions, options);
            this.options = $.metadata ? $.extend({}, this.options, element.metadata()) : this.options;
            updateElement(element, this.options);
        };
        this.init(element, options);
        this.select = function(event, ui) {};

    };
    $.fn.foursquareAutocomplete = function(options) {
        return this.each(function() {
            (new $.foursquareAutocomplete($(this), options));
        });
    };

    function updateElement(element, options) {
        element.autocomplete({
                source: function(request, response) {
                    $.ajax({
                        url: "https://api.foursquare.com/v2/venues/suggestCompletion",
                        dataType: "jsonp",
                        data: {
                            ll: options.latitude + "," + options.longitude,
                            v: "20150118",
                            oauth_token: options.oauth_token,
                            query: request.term
                        },
                        success: function(data) {
                            // Check to see if there was success
                            if (data.meta.code != 200) {
                                element.removeClass("ui-autocomplete-loading")
                                options.onError(data.meta.code, data.meta.errorType, data.meta.errorDetail);
                                return false;
                            }

                            response($.map(data.response.minivenues, function(item) {
                               
                                //console.log(item.categories[0].icon.prefix + "bg_32" + item.categories[0].icon.suffix);
                                return {
                                    name: item.name,
                                    id: item.id,
                                    address: (item.location.address == undefined ? "" : item.location.address),
                                    crossStreet: (item.location.crossStreet == undefined ? "" : item.location.crossStreet),
                                    cityLine: (item.location.city == undefined ? "" : item.location.city + ", "),
                                    photo: (item.categories[0].icon.prefix + "bg_32" + item.categories[0].icon.suffix),
                                    lat: (item.location.lat == undefined ? "" : item.location.lat),
                                    lng: (item.location.lng == undefined ? "" : item.location.lng),
                                    full: item
                                };

                            }));
                        },
                        error: function(header, status, errorThrown) {
                            options.onAjaxError(header, status, errorThrown);
                        }
                    });
                },
                minLength: options.minLength,
                select: function(event, ui) {
                    element.val(ui.item.name);
                    options.search(event, ui);
                    return false;
                },
                open: function() {
                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top ");
                },
                close: function() {
                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            })
            .data("autocomplete")._renderItem = function(ul, item) {

                return $("<li class='list-group-item'></li>")
                    .data("item.autocomplete", item)

                .append("<a>" + getAutocompleteText(item) + "</a>")

                .appendTo(ul);

            };
        $(".ui-autocomplete").wrap("<div class='col-lg-3' style='left: 0px;'></div>");
    };




    /// Builds out the <select> portion of autocomplete control
    function getAutocompleteText(item) {
        var text = "<div >  ";
        text += "<div class='categoryIconContainer'><img src='" + (item.photo == "" ? "" : item.photo) + "' /></div>";
        text += "<div class='h4'>" + item.name + "</div>";
        if (item.address == "" && item.cityLine == "")
            text += "<div class='autocomplete-detail'>&nbsp;</div>";
        if (item.address != "" && item.crossStreet == "")
            text += "<div class='autocomplete-detail'>" + item.address + "  -  " + item.cityLine + "</div>";
        if (item.address != "" && item.crossStreet != "")
            text += "<div class='autocomplete-detail'>" + item.address + " Con " + item.crossStreet + "  -  " + item.cityLine + "</div>";

        text += "</div>";
        return text;
    }
})(jQuery);