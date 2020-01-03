(function($){
  $.fn.listpickup = function(userOptions){
    options = $.extend({}, $.fn.listpickup.defaults, userOptions);

    var headerHTML = [
      "<button type='button' class='close' data-dismiss='modal' aria-label='关闭>'<span aria-hidden='true'>&times;</span></button>",
      "<h4 class='modal-title'>" + options.title + "</h4>"
    ].join(''),
    $textFilter = $([
      "<input type='text' placeholder='过滤...' class='form-control text-filter'/>"
    ].join('')),
    $body = $([
      "<div class='list-group' style='height:400px;overflow-y:scroll;'>",
      "</div>"
    ].join('')),
    $btnConfirm = $("<button type='button' class='btn btn-success'>确定</button>"),
    $btnClose = $([
      "<button type='button' class='btn btn-default' data-dismiss='modal'>关闭</button>"
    ].join('')),
    $modal = $([
      "<div class='modal fade' id='modal'>",
      "<div class='modal-dialog'>",
      "<div class='modal-content'>",
      "<div class='modal-header'></div>",
      "<div class='modal-body'></div>",
      "<div class='modal-footer'></div>",
      "</div>",
      "</div>",
      "</div>"
    ].join(''));

    $modal.attr("data-backdrop", options.backdropEnable);
    $modal.attr("data-keyboard", options.keyboardEnable);

    $textFilter.on('input', function () {
      if ($textFilter.val() && "" != $textFilter.val()) {
        $body.find("a.list-group-item:not(:contains('" + $textFilter.val() + "'))").hide();
        $body.find("a.list-group-item:contains('" + $textFilter.val() + "')").show();
      } else {
        $body.find("a.list-group-item").show();
      }
    });

    $modal.find(".modal-header").append(headerHTML);
    $modal.find(".modal-body").append($textFilter)
      .append($body);
    $modal.find(".modal-footer").append($btnConfirm)
      .append($btnClose);

    $("body").append($modal);

    this.each(function(i,ctrl){
      var $ctrl = $(ctrl);
      var data = [];

      //option merge
      for (key in $.fn.listpickup.defaults) {
        var attrVal = $ctrl.attr("data-" + key.replace(/([A-Z])/g, "-$1").toLowerCase());
        if (attrVal) {
          if (!userOptions)
            userOptions = {};
          userOptions[key] = attrVal;
        }
      }

      var buildOptions = function () {
        data = [];
        $ctrl.find("option").each(function (i, option) {
          data.push({ value: $(option).attr("value"), name: $(option).html() });
        });
      };

      $ctrl.on("mousedown", function (e) {
        e.preventDefault();
      }).off('click').on('click', function () {

        $btnConfirm.on('click', function () {
          if (!$modal.selectedValue) {
            console.warn("[bootstrap listpickup] Invalid selectedValue:" + $body.selectedValue);
          }

          if(options.multiple){
            //Remove hidden options
            $ctrl.find('.hidden-option').remove();

            var $hiddenOption = $("<option class='hidden-option' style='display:none;'></option>");
            $hiddenOption.attr('value', $modal.selectedValues).html($modal.selectedNames).appendTo($ctrl);

            $ctrl.val($modal.selectedValues).trigger('change');
          }else{
            $ctrl.val($modal.selectedValue).trigger('change');
          }

          $modal.modal('hide');
        });

        buildOptions();
        $.fn.listpickup.buildModal(data, $modal);

        $modal.modal('show');
      });
    });

    return this;
  };

  $.fn.listpickup.buildModal = function(data, $modal){
    $modal.find(".list-group").empty();
    $modal.find(".text-filter").val("");
    var selectedOptions = [];

    $.each(data,function(i,option){
      var $option = $("<a href='#' value='"+option.value+"' class='list-group-item'>"+option.name+"</a>");
      if(options.valueVisible)
        $option = $("<a href='#' value='" + option.value + "' class='list-group-item'>" + (option.value ? ("[" + option.value + "]"):'') + option.name+"</a>");
      $option.on('click',function(){
        if(options.multiple){
          if ($option.hasClass('active')){
            $option.removeClass("active");
            //remove from selectedOptions
            var readyToDeleteIndex = -1;
            $.each(selectedOptions,function(i,selectedOption){
              if (option.value == selectedOption.value){
                readyToDeleteIndex = i;
              }
            });

            selectedOptions.splice(readyToDeleteIndex,1);
          }else{
            $option.addClass("active");
            //add into selectedOptions
            selectedOptions.push({
              "value":option.value,
              "name":option.name
            });
          }

          var values = $.map(selectedOptions, function (opt) { return opt.value }).join(options.multipleSpliter);
          var names = $.map(selectedOptions, function (opt) { return opt.name }).join(options.multipleSpliter);

          $modal.selectedValues = values;
          $modal.selectedNames = names;
          $modal.selectedOptions = selectedOptions;
        }else{
          $modal.find(".list-group-item").removeClass("active");
          $option.addClass("active");
          $modal.selectedValue = $option.attr('value');
        }
      });

      $modal.find(".list-group").append($option);
    });
  };

  //options
  $.fn.listpickup.defaults = {
    title:"选择",
    valueVisible:false,
    filterEnable:true,
    keyboardEnable:true,
    backdropEnable:true,
    multiple:false,
    multipleSpliter:',',
  };

  $(document).ready(function(){
    $("select.listpickup").listpickup();
  });
})(window.jQuery);
