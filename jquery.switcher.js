(function( $, window, document, undefined ) {
    var Switcher = {
        init: function( options, elem ) {
            var self = this;

            self.elem = elem;
            self.$elem = $(elem);

            self.options = $.extend( {}, $.fn.switcher.options, options );

            // Need default wrap?
            if( self.options.useWrap ) {
                self.$elem.html(self.options.leftLabel + self.options.runner + self.options.rightLabel);
            }

            self.$lLabel = $('.b-switcher__label_l .label', self.$elem);
            self.$runner = $('.b-switcher__runner', self.$elem);
            self.$rLabel = $('.b-switcher__label_r .label', self.$elem);

            // WTF?
            (function addCssClass() {
                var cssClass = 'b-switcher';

                if (typeof self.options.cssModificator == 'string' && self.options.cssModificator.length > 0) {
                    cssClass += ' ' + self.options.cssModificator;
                }

                self.$elem.addClass(cssClass);
            })();


            // Public methods
            self.methods = {
                getStatus: self.getStatus
            };

            // Add event for labels
            self.$lLabel.on('click.switcher', function(e) {
                self.setStatus(1);
                e.preventDefault();
            });
            self.$rLabel.on('click.switcher', function(e) {
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
            self.$runner.on('mousedown.switcher', function() {
                var $parent = self.$runner.parent(),
                    $document = $(document),
                    minPos = 0,
                    maxPos = $parent.width() - self.$runner.outerWidth(true) + minPos,
                    pos = 0,
                    time = (new Date()).getTime();

                self.$runner.addClass('b-switcher__runner_move');

                $document.on('mousemove.switcher', function(e) {
                    pos = e.clientX - $parent.offset().left + minPos;
                    if(pos < minPos) {
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
                $document.on('mouseup.switcher', function(e) {
                    $document.unbind('.switcher');
                    self.$runner.removeClass('b-switcher__runner_move').removeAttr('style');

                    if ((((new Date()).getTime() - time) < 200 )) {

                        var status = self.getStatus();

                        if (status === 1) {
                            status = 0;
                        } else {
                            status = 1;
                        }

                        self.setStatus(status);

                    } else {

                        if(pos > (maxPos - minPos)/2) {
                            self.setStatus(0, false);
                        } else {
                            self.setStatus(1, false);
                        }

                    }

                });
            });

            // Set first-time status
            if( self.options.status === 1 ) {
                self.$lLabel.parent().addClass('b-switcher__label_active');
            } else {
                self.$rLabel.parent().addClass('b-switcher__label_active');
            }
        },

        setStatus: function( status, animateIE ) {
            var self = this,
                animateIE = animateIE === false ? false : true;

            // Turn ON
            if( status === 1 && self.options.status !== 1 ) {
                self.options.status = status;
                // emulation CSS3 transition in IE
                if($.browser.msie && animateIE) {
                    self.$runner.animate({left: 0}, 200);
                }
                self.$rLabel.parent().removeClass('b-switcher__label_active');
                self.$lLabel.parent().addClass('b-switcher__label_active');
                self.options.onTurnOn( status );
            }
            // Turn OFF
            else if( status === 0 && self.options.status !== 0 ) {
                self.options.status = status;
                // emulation CSS3 transition in IE
                if($.browser.msie && animateIE) {
                    self.$runner.animate({left: 17}, 200);
                }
                self.$lLabel.parent().removeClass('b-switcher__label_active');
                self.$rLabel.parent().addClass('b-switcher__label_active');

                self.options.onTurnOff( status );
            }

            return self.options.status;
        },

        getStatus: function() {
            return this.options.status;
        }

    };

    $.fn.switcher = function( options ) {
        return this.each(function() {
            var switcher = Object.create( Switcher );

            if ( Switcher[ options ] ) {
                return Switcher[ options ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof options === 'object' || typeof options === 'undefined') {
                return switcher.init( options, this );
            } else {
                $.error( '"' + options + '" method does not exist in jQuery.switcher');
            }

        });
    };

    $.fn.switcher.options = {
        status: 0,  // 0 или 1, по умолчанию выключен, т.е. 0
        useWrap: true,
        leftLabel: '<div class="b-switcher__label b-switcher__label_l"><a href="#" class="label">ON</a></div>',
        rightLabel: '<div class="b-switcher__label b-switcher__label_r"><a href="#" class="label">OFF</a></div>',
        runner: '<div class="b-switcher__switch"><div class="b-switcher__runner"></div></div>',
        cssModificator: '',
        onTurnOn: function( status ) {}, // callback на ВКЛючение
        onTurnOff: function( status ) {} // callback на ВЫКЛючение
    };

})( jQuery, window, document );
