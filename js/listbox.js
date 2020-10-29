function renderListbox(item) {
    return '<option id="'+ item.id + '">' + item.id + ' - ' + item.title + '</option>';
}

function sortSelectableList() {
    let option_select_default = $('#selectable-list option');
    option_select_default.sort(function(a,b){
        return a.getAttribute('id') - b.getAttribute('id');
    });
    $('#selectable-list').html(option_select_default);
} //

let json = '{"fieldsExport": [{"id" : "2" , "title" : "氏名"},{"id" : "1" , "title" : "社員番号"},{"id" : "3" , "title" : "グループ"},{"id" : "4" , "title" : "グループ"},{"id" : "5" , "title" : "出勤日数"},{"id" : "6" , "title" : "欠勤日数"},{"id" : "7" , "title" : "総労働時間"},{"id" : "8" , "title" : "総労働時間"},{"id" : "9" , "title" : "所定外労働時間"},{"id" : "10" , "title" : "深夜労働時間"},{"id" : "11" , "title" : "早出残業"},{"id" : "12" , "title" : "社員番号"}]}'
let data = JSON.parse(json);

let html = '';
data.fieldsExport.map(function(field){
    html += renderListbox(field);
});
$('#selectable-list').html(html);

var moveSelected = function () {
    let $options = $('#selectable-list option:selected');
    $options.appendTo("#selection-list");
    $('#selection-list option').prop('selected', false);
    disabledMove();
}

var moveSelectable = function () {
    let $options = $('#selection-list option:selected');
    $options.appendTo("#selectable-list");
    $('#selectable-list option').prop('selected', false);
    sortSelectableList();
    disabledMove();
    checkDisableSort();
}

var addBlank = function () {
    //id = A
    var blank = '<option id="A"">Blank</option>';
    $(blank).appendTo('#selection-list');
    $('#selection-list option').prop('selected', false);
}

var addZero = function () {
    //id = B
    var zero = '<option id="B">Zero</option>';
    $(zero).appendTo('#selection-list');
    $('#selection-list option').prop('selected', false);
}

var changeOrder = function(mode) {
    var option_selection_checked = $('#selection-list option:checked');

    if($('#selection-list option').length > 0) {
      if(mode == "first") {
        option_selection_checked.insertBefore($('#selection-list option:first'));
      }

      if(mode == "up") {
        option_selection_checked.each(function(index,ele) {
          var old_index = $('#selection-list option').index(ele);
          $($('#selection-list option')[old_index - 1]).insertAfter($('#selection-list option')[old_index]);
        });
      }
      
      if(mode == 'down') {
        $(option_selection_checked.get().reverse()).each(function(index, ele) { 
          var old_index = $('#selection-list option').index(ele);
          $($('#selection-list option')[old_index + 1]).insertBefore($('#selection-list option')[old_index]);
        });
      }

      if(mode == "last") {
        option_selection_checked.insertAfter($('#selection-list option:last'));
      }

      checkDisableSort();
    }
}

var getIdArr = function() {
    var idSelection = [];
    if($('#selection-list option').length > 0) {
        $('#selection-list option').each(function (index,opt) {
            idSelection.push(opt.getAttribute('id'));
        })
    }
}

function sortSelectableList() {
    $('#selectable-list option#A, #selectable-list option#B').remove();
    let option_select_default = $('#selectable-list option');
    option_select_default.sort(function(a,b){
        return a.getAttribute('id') - b.getAttribute('id');
    });
    $('#selectable-list').html(option_select_default);
}

function disabledMove() {
    if($('#selectable-list option:checked').length > 0) {
      $('.btn-add').prop('disabled', false);
    } else {
      $('.btn-add').prop('disabled', true);
    }

    if($('#selection-list option:checked').length > 0) {
      $('.btn-remove').prop('disabled', false);
    } else {
      $('.btn-remove').prop('disabled', true);
    }
		return false;
}

function checkDisableSort() {
    var selection = $('#selection-list option');
    var selection_checked = $('#selection-list option:checked');
    
    var isFirst = false;
    var isLast = false;

    if(selection_checked.length > 0) {
      var index_first = selection.index(selection_checked[0]);
      var index_last = selection.index(selection_checked[selection_checked.length - 1]);

      if(index_first == 0) {
        isFirst = true;
      }

      if(index_last == (selection.length - 1)) {
        isLast = true;
      }

      if(isFirst && isLast) {
        $('.btn-last, .btn-down, .btn-first, .btn-up').prop('disabled', true);
      } else if(isFirst) {
        // disable btn
        $('.btn-last, .btn-down').prop('disabled', false);
        $('.btn-first, .btn-up').prop('disabled', true);
      } else if (isLast) {
        $('.btn-first, .btn-up').prop('disabled', false);
        $('.btn-last, .btn-down').prop('disabled', true);
      } else {
        $('.btn-first, .btn-up, .btn-last, .btn-down').prop('disabled', false);
      }
    } else {
      $('.btn-first, .btn-up, .btn-last, .btn-down').prop('disabled', true);
    }
}

$(document).ready(function(){  
    $('#selection-list').on('mouseup', function() {
        $(this).focus().blur();
        checkDisableSort();
        disabledMove();
    });
      
    $('#selectable-list').on('mouseup', function() {
        $(this).focus().blur();
        disabledMove();
    }); 
})
 