//=require jquery/dist/jquery.js
//=require popper.js/dist/umd/popper.js
//=require bootstrap/dist/js/bootstrap.js
//=require lodash/lodash.min.js
if (typeof moment === 'undefined') {
//=require moment/min/moment.min.js
}
//=require jquery-datetimepicker/build/jquery.datetimepicker.full.min.js
//=require @bndynet/jslib/dist/jslib.min.js
//=require _jq.js
//=require _alertify.js
//=require _dialog.js
//=require _pace.js
//=require _select.js

// setup
bb = bbootstrap = {
    version: '{{bbootstrap-version}}',
    options: {
        locale: 'en-US',
        datetimeFormat: 'YYYY-MM-DD H:mm',
        timeFormat: 'H:mm',
        dateFormat: 'YYYY-MM-DD'
    },
    langs: {
        default: {
            ok: 'Ok',
            cancel: 'Cancel',
            yes: 'Yes',
            no: 'No',
            browse: 'Browse'
        },
        get: function(locale) {
            var $this = this;
            if (!$this[locale]) {
                $this[locale] = $this.getDefault();
            }
            return $this[locale];
        },
        getDefault: function() {
            var $this = this;
            _.forEach($this['default'], function(value, key) {
                $this['default'][key + 'Label'] = value;
            });
            return $this['default'];
        },
        getValue: function(locale, path) {
            var $this = this;
            return  _.get($this.get(locale), path);
        },
        define: function(locale, value) {
            var $this = this;
            $this[locale] = _.assignIn({}, $this['default'], value);
            _.forEach($this[locale], function(value, key) {
                $this[locale][key + 'Label'] = value;
            });
            return $this[locale];
        },
        defineFrom: function(originLocale, locale, value) {
            var $this = this;
            $this[locale] = _.assignIn({}, $this.get(originLocale), value);
            return $this[locale];
        }
    },
    defineLang: function(locale, value) {
        var $this = this;
        $this.langs.define(locale, value);
    },
    attachStyles: function(styles) {
        var elStyle;
        if ($('style[origin=bbootstrap]').length > 0) {
            elStyle = $($('style[origin=bbootstrap]')[0]);
        } else {
            elStyle = $('<style origin="bbootstrap">/* placeholder for bbootstrap */</style>');
            $('head').append(elStyle);
        }
        elStyle.html(elStyle.html() + '\n' + styles);
    },
    setup: function (options) {
        var $this = this;
        var lang = $this.langs.getDefault();
        $this.langs.define('en');
        $this.langs.define('en-US');
        $this.options = $.extend({}, $this.options, options);

        // locale
        if ($this.options.locale) {
            lang = $this.langs.get($this.options.locale);
            moment.locale($this.options.locale);
            if ($this.options.locale.indexOf('-') > 0) {
                var l = $this.options.locale.substring(0, $this.options.locale.indexOf('-'));
                jQuery.datetimepicker.setLocale(l);
            } else {
                jQuery.datetimepicker.setLocale($this.options.locale);
            }
        }

        // alertify
        var alertifyOptions = $.extend({}, lang);
        if ($this.options.alertify) {
            alertifyOptions = $.extend({}, alertifyOptions, $this.options.alertify);
        }
        alertify.setup(alertifyOptions);

        // pace.js
        if ($this.options.pace || $this.options.progressBar) {
            $this.options.pace = $.extend({}, $this.options.pace, $this.options.progressBar);
            $(function () {
                if (window) {
                    window.paceOptions = $this.options.pace;
                    window.paceOptions.restartOnRequestAfter = true;
                }
                Pace.start();
                if ($this.options.pace.color) {
                    $('.pace-progress').css('background-color', $this.options.pace.color);
                    $('.pace-activity').css({
                        'border-top-color': $this.options.pace.color,
                        'border-left-color': $this.options.pace.color,
                    });
                }
                if ($this.options.pace.theme) {
                    $('.pace').addClass('pace-' + $this.options.pace.theme);
                }
            });
        }

        // document ready
        jQuery.datetimepicker.setDateFormatter('moment');
        $(function () {
            // init components
            $('[data-toggle="datetimepicker"]').each(function () {
                var format = $(this).data('format') || $this.options.datetimeFormat;
                $(this).datetimepicker(
                    $.extend({
                        format: format,
                    }, $this._getElementDataOptions($(this)))
                );
            });
            $('[data-toggle="datepicker"]').each(function () {
                var format = $(this).data('format') || $this.options.dateFormat;
                $(this).datetimepicker(
                    $.extend({
                        timepicker: false,
                        format: format,
                    }, $this._getElementDataOptions($(this)))
                );
            });
            $('[data-toggle="timepicker"]').each(function () {
                var format = $(this).data('format') || $this.options.timeFormat;
                $(this).datetimepicker(
                    $.extend({
                        datepicker: false,
                        format: format,
                    }, $this._getElementDataOptions($(this)))
                );
            });

            // select
            $('select[data-toggle="select"]').each(function() {
                $(this).bselect();
            });

            // file input
            bb.attachStyles('.custom-file-label:after {content:"' + lang.browse + '";}');
            $('body').on('change', '.custom-file-input', function () {
                var eleFile = $(this)[0];
                var eleLabel = $(eleFile).next();

                var placeholder = eleLabel.html();
                if (!eleLabel.data('placeholder')) {
                    eleLabel.data('placeholder', placeholder);
                } else {
                    placeholder = eleLabel.data('placeholder');
                }

                var selectFile = eleFile.value;
                if (selectFile) {
                    eleLabel.html(selectFile);
                } else {
                    eleLabel.html(placeholder);
                }
            });

            // class starts with action-*
            $('body').on('click', '.action-top, a[href="#top"]', function() {
                $("html, body").animate({ scrollTop: 0 }, "slow");
                return false;
            });
        });
    },

    // common functions
    toggleLeftSide: function() {
        $('body').toggleClass('sidebar-mini');
    },
    toggleRightSide: function() {
        $('.layout-admin > .side-right, .layout-admin > .sidebar-assist').toggleClass('show');
    },

    alert: function(msg, fn) {
        alertify.alert(msg, fn);
    },
    confirm: function(msg, fnOk, fnCancel) {
        alertify.confirm(msg, fnOk, fnCancel);
    },
    prompt: function(msg, fnOk) {
        alertify.prompt(msg, function(val) {
            if (fnOk && typeof fnOk === 'function') {
                fnOk(val);
            }
        });
    },
    info: function(msg) {
        alertify.notify(msg);
    },
    success: function(msg) {
        alertify.success(msg);
    },
    error: function(msg) {
        alertify.error(msg);
    },
    loading: function(destory) {
        if (destory === false) {
            $('body').removeClass('has-overlay').find('> .loading-wrapper').remove();
            return;
        }
        $('body').addClass('has-overlay').bloading();
    },
    fixTopOnScroll: function(selector, resolve, reject) {
        this.pinTopOnScroll(selector, resolve, reject);
    },
    pinTopOnScroll: function(selector, resolve, reject) {
       $(selector).pinTopOnScroll(resolve, reject);
    },

    // private functions
    _getElementDataOptions: function(jqEl) {
        var dataOptions = $(jqEl).data('options');
        if (dataOptions) {
            return eval('(' + dataOptions + ')');
        }
        return null;
    },
};