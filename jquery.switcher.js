(function($, window, document, undefined) {
    var Switcher = {
        init: function (options, el) {
            var self = this;

            self.el = el;
            self.$el = $(el);

            self.options = $.extend( {}, $.fn.switcher.options, options );

            // Need default wrap?
            if (self.options.useWrap) {
                self.$el.html(
                    '<div class="ui-switch__label ui-switch__label_l">' + self.options.leftLabel + '</div>' +
                    '<div class="ui-switch__switch"><div class="ui-switch__runner"></div></div>' +
                    '<div class="ui-switch__label ui-switch__label_r">' + self.options.rightLabel + '</div>'
                );
            }

            self.$lLabel = $('.ui-switch__label_l', self.$el);
            self.$runner = $('.ui-switch__runner', self.$el);
            self.$rLabel = $('.ui-switch__label_r', self.$el);

            // WTF?
            (function addCssClass() {
                var cssClass = 'ui-switch';

                if (typeof self.options.cssModificator == 'string' && self.options.cssModificator.length > 0) {
                    cssClass += ' ' + self.options.cssModificator;
                }

                self.$el.addClass(cssClass);
            })();


            // Public methods
            self.methods = {
                getStatus: self.getStatus
            };

            // Add event for labels
            self.$lLabel.on('click.switcher', function (e) {
                self.setStatus(1);
                e.preventDefault();
            });
            self.$rLabel.on('click.switcher', function (e) {
                self.setStatus(0);
                e.preventDefault();
            });

            /*
             * Проблема в том, что при mouseup событие всплывает до родителя и отрабатывает этот bind,
             * получается двоёное переключение.
             * Пока не знаю как решить, решил закоментировать.
             self.$runner.parent().bind('click.switcher', function(e) {
                 var status = self.getStatus();

                 if(status === 1) {
                    status = 0;
                 } else {
                    status = 1;
                 }

                 self.setStatus( status );
             });*/

            // Drag'n'Drop
            self.$runner.on('mousedown.switcher', function () {
                var $parent = self.$runner.parent(),
                    $document = $(document),
                    minPos = 0,
                    maxPos = $parent.width() - self.$runner.outerWidth(true) + minPos,
                    pos = 0,
                    time = (new Date()).getTime();

                self.$runner.addClass('ui-switch__runner_move');

                $document.on('mousemove.switcher', function (e) {
                    pos = e.clientX - $parent.offset().left + minPos;
                    if (pos < minPos) {
                        pos = minPos;
                    } else if (pos > maxPos) {
                        pos = maxPos;
                    }

                    self.$runner.css(
                        {
                            left: pos
                        }
                    );
                });

                // then mouseup unbind event from document and set new status
                $document.on('mouseup.switcher', function (e) {
                    $document.unbind('.switcher');
                    self.$runner.removeClass('ui-switch__runner_move').removeAttr('style');

                    if ((((new Date()).getTime() - time) < 200)) {

                        var status = self.getStatus();

                        if (status === 1) {
                            status = 0;
                        } else {
                            status = 1;
                        }

                        self.setStatus(status);

                    } else {

                        if (pos > (maxPos - minPos)/2) {
                            self.setStatus(0, false);
                        } else {
                            self.setStatus(1, false);
                        }

                    }

                });
            });

            // Set first-time status
            if (self.options.status) {
                self.$lLabel.addClass('ui-switch__label_active');
            } else {
                self.$rLabel.addClass('ui-switch__label_active');
            }
        },

        setStatus: function (status, animateIE) {
            var self = this;

            // Turn ON
            if (status === 1 && self.options.status !== 1) {
                self.options.status = status;
                // emulation CSS3 transition in IE
                // TODO: $.browser removed in jQuery 1.9
                if ($.browser && $.browser.msie && animateIE) {
                    self.$runner.animate({left: 0}, 200);
                }
                self.$rLabel.removeClass('ui-switch__label_active');
                self.$lLabel.addClass('ui-switch__label_active');
                self.options.onTurnOn( status );

            // Turn OFF
            } else if (status === 0 && self.options.status !== 0) {
                self.options.status = status;

                // emulation CSS3 transition in IE
                // TODO: $.browser removed in jQuery 1.9
                if ($.browser && $.browser.msie && animateIE) {
                    self.$runner.animate({left: 17}, 200);
                }
                self.$lLabel.removeClass('ui-switch__label_active');
                self.$rLabel.addClass('ui-switch__label_active');

                self.options.onTurnOff(status);
            }

            return self.options.status;
        },

        getStatus: function() {
            return this.options.status;
        }

    };

    $.fn.switcher = function(options) {
        return this.each(function () {
            var switcher = Object.create(Switcher);

            if (Switcher[options]) {
                return Switcher[options].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof options === 'object' || typeof options === 'undefined') {
                return switcher.init(options, this);
            } else {
                $.error('"' + options + '" method does not exist in jQuery.switcher');
            }
        });
    };

    $.fn.switcher.options = {
        status: 0,  // 0 или 1, по умолчанию выключен, т.е. 0
        useWrap: true,
        leftLabel: 'ON',
        rightLabel: 'OFF',
        cssModificator: '',
        onTurnOn: function( status ) {}, // callback на ВКЛючение
        onTurnOff: function( status ) {} // callback на ВЫКЛючение
    };

})(jQuery, window, document);
