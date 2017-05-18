(function($){
  $.fn.listpickup = function(userOptions){
    //variables
    var $ctrl = this,
    data = [],
    $addonBtnHtml = $([
      "<span class='input-group-btn'>",
        "<button class='btn btn-default'>...</button>",
      "</span>"
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
    //functions
    var init = function(){
      if(!$ctrl.parents(".input-group"))
        console.error("[bootstrap listpickup] listpickup must be in a (bootstrap)input-group.");

      buildOptions();
      initModal();
      initAddonBtn();
    },
    buildOptions = function(){
      $ctrl.find("option").each(function(i,option){
        data.push({value:$(option).attr("value"),name:$(option).html()});
      });
    },
    initModal = function(){
      var headerHTML = [
        "<button type='button' class='close' data-dismiss='modal' aria-label='关闭>'<span aria-hidden='true'>&times;</span></button>",
        "<h4 class='modal-title'>"+options.title+"</h4>"
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
      ].join(''));

      $modal.attr("data-backdrop", options.backdropEnable);
      $modal.attr("data-keyboard", options.keyboardEnable);

      $textFilter.on('input',function(){
        if($textFilter.val()&&""!=$textFilter.val()){
          $body.find("a.list-group-item:not(:contains('"+$textFilter.val()+"'))").hide();
          $body.find("a.list-group-item:contains('"+$textFilter.val()+"')").show();
        }else{
          $body.find("a.list-group-item").show();
        }
      });

      $btnConfirm.on('click',function(){
        if($modal.selectedValue)
          $ctrl.val($modal.selectedValue).trigger('change');
        else
          console.warn("[bootstrap listpickup] Invalid selectedValue:" + $body.selectedValue);

        $modal.modal('hide');
      });

      $modal.find(".modal-header").append(headerHTML);
      $modal.find(".modal-body").append($textFilter);
      $modal.find(".modal-body").append($body);
      $modal.find(".modal-footer").append($btnConfirm);
      $modal.find(".modal-footer").append($btnClose);

      $("body").append($modal);
    },
    initAddonBtn = function(){
      //init addonBtn
      $addonBtnHtml.on("click",function(){
        $.fn.listpickup.buildModal(data, $modal);
        $modal.modal("show");
      });

      $ctrl.on("mousedown",function(e){
        e.preventDefault();
      }).on('click',function(){
        $.fn.listpickup.buildModal(data, $modal);
        $modal.modal('show');
      });

      $ctrl.after($addonBtnHtml);
    };
    //option merge
    for(key in $.fn.listpickup.defaults){
      var attrVal = $ctrl.attr("data-"+key.replace(/([A-Z])/g,"-$1").toLowerCase());
      if(attrVal){
        if(!userOptions)
          userOptions = {};
        userOptions[key] = attrVal;
      }
    }

    options = $.extend({},$.fn.listpickup.defaults,userOptions);

    //init
    init();

    return this;
  };

  $.fn.listpickup.buildModal = function(data, $modal){
    $modal.find(".list-group").empty();
    $modal.find(".text-filter").val("");

    $.each(data,function(i,option){
      var $option = $("<a href='#' value='"+option.value+"' class='list-group-item'>"+option.name+"</a>");
      if(options.valueVisible)
        $option = $("<a href='#' value='"+option.value+"' class='list-group-item'>["+option.value+"]"+option.name+"</a>");
      $option.on('click',function(){
        $modal.selectedValue = $option.attr('value');
      });

      $modal.find(".list-group").append($option);
    });
  };

  //options
  $.fn.listpickup.defaults = {
    title:"选择",
    valueVisible:true,
    filterEnable:true,
    keyboardEnable:true,
    backdropEnable:true
  };

  $(document).ready(function(){
    $("select.listpickup").listpickup();
  });
})(window.jQuery);
