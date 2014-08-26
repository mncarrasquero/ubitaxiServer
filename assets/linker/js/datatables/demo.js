+function ($) { "use strict";

  $(function(){

  // datatable
  $('[data-ride="datatables"]').each(function() {
    var oTable = $(this).dataTable( {
      "bProcessing": true,
      "sAjaxSource": "/api/listDrivers",
      "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
      "sPaginationType": "full_numbers",

      "aoColumns": [

      { "mData": null , //its null here because history column will contain the mRender
    "mRender" : function ( data, type, full ) {
    return '<a href="/viewDriver?='+full.id+'" class="btn btn-default btn-xs">ver</a>';}
  },



  
       { "mData": "name" },
        { "mData": "lastname" },
        { "mData": "phone" },
        { "mData": "car.brand" },
        { "mData": "car.model" },
        { "mData": "car.color" },
        { "mData": "car.plate" },


 

      ]
    } );
  });






  });
}(window.jQuery);