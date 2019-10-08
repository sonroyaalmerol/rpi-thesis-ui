$(function() {
  $(document).ready(function() {
                var oTable = $('#data').DataTable({
                    columnDefs:[
			{targets: 0, render: (data) => {
                        return moment(data).format("MMM DD YYYY, h:mm:ss a");
			}},
			
			{targets: [1,2,3,4,5], orderable: false}],
			
			order: [[ 0, "desc" ]],
			searching: false,
			lengthChange: false
                });
            } );
    
  $("#datefrom").datepicker({
      onSelect: function(date) {
      minDateFilter = new Date(date).getTime();
      oTable.fnDraw();
    }
  }).keyup(function() {
    minDateFilter = new Date(this.value).getTime();
    oTable.fnDraw();
  });

  $("#dateto").datepicker({
      onSelect: function(date) {
      maxDateFilter = new Date(date).getTime();
      oTable.fnDraw();
    }
  }).keyup(function() {
    maxDateFilter = new Date(this.value).getTime();
    oTable.fnDraw();
  });

});

// Date range filter
minDateFilter = "";
maxDateFilter = "";

$.fn.dataTableExt.afnFiltering.push(
  function(oSettings, aData, iDataIndex) {
    if (typeof aData._date == 'undefined') {
      aData._date = new Date(aData[0]).getTime();
    }

    if (minDateFilter && !isNaN(minDateFilter)) {
      if (aData._date < minDateFilter) {
        return false;
      }
    }

    if (maxDateFilter && !isNaN(maxDateFilter)) {
      if (aData._date > maxDateFilter) {
        return false;
      }
    }

    return true;
  }
);
