
(function () {
    'use strict';
    
    var transitionables = [];

    var Transitionable = function  (startValue, easing) {
        this.startValue = startValue;
        this.active     = false;
        this.easing     = easing || 'linear';
        transitionables.push(this);
    }

    Transitionable.prototype.to = function (options) {

        if (typeof options.startValue !== 'undefined') {
            this.startValue = options.startValue;
        }
        this.endValue     = options.endValue;
        this.period       = options.period;
        this.startTime    = (new Date()).getTime();
        this.currentValue = this.startValue;
        this.active       = true;
        this.stepCallback = options.stepCallback || function () {
            };
        this.endCallback  = options.endCallback || function () {
            };
        _calculateIncrement.call(this);
        return this;
    };

    function _calculateIncrement () {
        var diff  = this.endValue - this.startValue;
        this.step = diff / EasingFunctions[this.easing](this.period);
    }

    function _easingWrapper (t) {
        return this.step * EasingFunctions[this.easing](t);
    }

    function _calculateDiffTime () {
        this.diffTime = (new Date()).getTime() - this.startTime;
    }

    Transitionable.prototype.increment = function () {
        var result;
        result   = this.startValue + _easingWrapper.call(this, this.diffTime);
        return result;
    };
    Transitionable.prototype.get = function () {
        return this.currentValue;
    };
    Transitionable.prototype.render = function () {
        var oldValue = this.currentValue;
        _calculateDiffTime.call(this);

        if (this.diffTime < this.period) {
            this.currentValue = this.increment();
            this.stepCallback(this.currentValue, oldValue);
        } else {
            this.currentValue = this.endValue;
            this.active       = false;
            this.startValue = this.endValue;
            this.endCallback(this.currentValue, oldValue);
        }
    };

    Transitionable.update = function () {
        var i;
        for (i = 0; i < transitionables.length; i++) {
            if (transitionables[i].active === true) {
                transitionables[i].render();
            }

        }
    };

    var EasingFunctions = {
        // no easing, no acceleration
        linear:         function (t) {
            return t;
        },
        // accelerating from zero velocity
        easeInQuad:     function (t) {
            return t * t;
        },
        // decelerating to zero velocity
        easeOutQuad:    function (t) {
            return t * (2 - t);
        },
        // acceleration until halfway, then deceleration
        easeInOutQuad:  function (t) {
            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },
        // accelerating from zero velocity
        easeInCubic:    function (t) {
            return t * t * t;
        },
        // decelerating to zero velocity
        easeOutCubic:   function (t) {
            return (--t) * t * t + 1;
        },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function (t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        // accelerating from zero velocity
        easeInQuart:    function (t) {
            return t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuart:   function (t) {
            return 1 - (--t) * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) {
            return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        },
        // accelerating from zero velocity
        easeInQuint:    function (t) {
            return t * t * t * t * t;
        },
        // decelerating to zero velocity
        easeOutQuint:   function (t) {
            return 1 + (--t) * t * t * t * t;
        },
        // acceleration until halfway, then deceleration
        easeInOutQuint: function (t) {
            return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
        }
    };

    (function animloop () {
        requestAnimationFrame(animloop);
        Transitionable.update();
    })();

    window.Transitionable = Transitionable;
})();
    