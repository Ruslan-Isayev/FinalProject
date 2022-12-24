(function($){
  'use strict';
  
  $.fn.multipleFilterMasonry = function(options){
    var cache=[];
    var filters = [];

    if(options.selectorType === 'list') {
      $(options.filtersGroupSelector).children().each(function() {
        filters.push($(this).data('filter'));
      });
    }

    
    var init = function($container){
      $container.find(options.itemSelector).each(function(){
        cache.push($(this));
      });
      $container.masonry(options);
    };

    
    var filterItems = function(selector){
      var result=[];
      $(cache).each(function(item){
        $(selector).each(function(index,sel) {
          if(cache[item].is(sel)){
            if($.inArray(cache[item], result) === -1) result.push(cache[item]);
          }
        });
      });
      return result;
    };

    
    var reload = function($container,items){
      $container.empty();
      $(items).each(function(){
        $($container).append($(this));
      });
      $container.masonry('reloadItems');
      $container.masonry();
    };

    
    var hashFilter = function($container) {
      var hash = window.location.hash.replace("#", "");
      if($.inArray(hash, filters) !== -1) {
        reload($container, $('.' + hash));
      }
    }

    var proc = function($container){
      $(options.filtersGroupSelector).find('input[type=radio]').each(function(){
        $(this).change(function(){
          var selector = [];
          $(options.filtersGroupSelector).find('input[type=radio]').each( function() {
            if ( $(this).is(':checked') ) {
              selector.push( '.' + $(this).val() );
            }
          });
          var items = cache;
          if (selector.length > 0) {
            items = filterItems(selector);
          }
          reload($container,items);
        });
      });
    };

    var procUL = function($container){
      $(options.filtersGroupSelector).children().each(function(){
        $(this).click(function(){
          $(options.filtersGroupSelector).children().removeClass('selected');
          window.location.hash = $(this).data('filter');
          var selector = [];
          selector.push( '.' + $(this).data('filter') );
          $(this).addClass('selected');
          var items = cache;
          if (selector.length > 0) {
            items = filterItems(selector);
          }
          reload($container,items);
        });
      });

      hashFilter($container);
      $(options.filtersGroupSelector).children().removeClass('selected');
      $('.filters li[data-filter='+window.location.hash.replace("#", "")+']').addClass('selected');
    };

    return this.each(function() {
      var $$ = $(this);
      init($$);
      options.selectorType === 'list' ? procUL($$) : proc($$);
    });
  };
}(window.jQuery));
