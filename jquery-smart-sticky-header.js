/*
 * Smart Sticky Header
 * https://github.com/yaplas/smart-sticky-header
 *
 * Copyright (c) 2015 Agustin Lascialandare
 * MIT license
 */
(function($) {
  var count=0;

  $.isSmartStickyHeader = function(elem) {
    return !!$(elem).data('SmartStickyHeader');
  };

  $.SmartStickyHeader = function(elem, options) {

    options = options || {};
    options.railClass = (options.railClass ? options.railClass + ' ' : '') + 'sticky-header-rail';

    var $window = $(window);
    var $elem = $(elem);
    $elem.data('SmartStickyHeader', true).css({'pointer-events':'all'});
    var railId = 'ssh' + (++count);

    var width, height, offset, $rail, $replacement , $shadow;

    init();

    $window.on('scroll', scrollHandler);
    $window.on('resize', debounce(function(){
      unmount();
      init();
    }, 500));

    function init() {
      setTimeout(function(){
        mount();
        setTimeout(scrollHandler,10);
      }, 10);
    }

    function mount() {
      offset = $elem.offset();
      width = $elem.outerWidth();
      height = $elem.outerHeight(true);

      $rail = $('<div id="' + railId + '" class="' + options.railClass + '"></div>').css({
        top:0,
        padding:0,
        left: offset.left + 'px',
        width: width + 'px',
        height: height + 'px',
        overflow:'hidden',
        position:'fixed',
        'pointer-events': 'none'
      });

      $shadow = $('<div class="sticky-header-shadow"></div>').css({
        height: height + 'px',
        'pointer-events': 'none'
      });

      $replacement = $('<div class="sticky-header-replacement"></div>').css({
        height: height + 'px'
      });

      $elem.before($replacement);
      $elem.before($rail);
      $rail.append($elem);
      $rail.append($shadow);
    }

    function unmount() {
      $replacement.remove();
      $rail.replaceWith($elem);
    }

    var lastScroll;
    function scrollHandler(){
      if (!$rail) {
        return;
      }
      if (!exists()) {
        return $window.off('scroll', scrollHandler);
      }
      lastScroll = lastScroll || 0;
      // avoid negative values when scroll bouncing (eg. safari)
      var scroll = Math.max(0, $(window).scrollTop());
      var diff = scroll - lastScroll;
      lastScroll = scroll;

      // if header has a top margin, only reveal it when visible at the top
      var marginTop = parseInt($elem.css('margin-top'));

      var railScrollTop = $rail.scrollTop() + diff;
      railScrollTop = Math.max(Math.min(scroll, marginTop), railScrollTop);
      $rail.scrollTop(railScrollTop);

    }

    function exists() {
      return $('#'+railId).length;
    }

    function debounce(func, milliseconds) {
      var args, self, debouncing=0;
      return function() {
        debouncing++;
        args = Array.prototype.slice.call(arguments);
        self = this;
        if (debouncing===1) {
          executeFunc(0);
        }
      };
      function executeFunc(current) {
        if(current===debouncing) {
          func.apply(self, args);
          debouncing=0;
        } else {
          setTimeout(function(){ executeFunc(debouncing); }, milliseconds);
        }
      }
    }
  };

  $.fn.smartStickyHeader = function(options) {
    return this.each(function() {
      return $.SmartStickyHeader(this, options);
    });
  };
})(jQuery);
