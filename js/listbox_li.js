function renderListbox(item) {
    return '<li id="'+ item.id + '">' + item.id + ' - ' + item.title + '</li>';
}

let json = '{"fieldsExport": [{"id" : "2" , "title" : "氏名"},{"id" : "1" , "title" : "社員番号"},{"id" : "3" , "title" : "グループ"},{"id" : "4" , "title" : "グループ"},{"id" : "5" , "title" : "出勤日数"},{"id" : "6" , "title" : "欠勤日数"},{"id" : "7" , "title" : "総労働時間"},{"id" : "8" , "title" : "総労働時間"},{"id" : "9" , "title" : "所定外労働時間"},{"id" : "10" , "title" : "深夜労働時間"},{"id" : "11" , "title" : "早出残業"},{"id" : "12" , "title" : "社員番号"}]}'
let data = JSON.parse(json);

let html = '';
data.fieldsExport.map(function(field){
    html += renderListbox(field);
});
$('#selectable-list').html(html);

var moveSelected = function () {
    let $options = $('#selectable-list li[data-selected="true"]');
    $options.appendTo("#selection-list");
    $('#selection-list li').attr('data-selected', false);
    disabledMove();
    checkDisableSort();
}

var moveSelectable = function () {
    let $options = $('#selection-list li[data-selected="true"]');
    $options.appendTo("#selectable-list");
    $('#selectable-list li').attr('data-selected', false);
    sortSelectableList();
    disabledMove();
    checkDisableSort();
}

var addBlank = function () {
    //id = A
    var blank = '<li id="A">Blank</li>';
    $(blank).appendTo('#selection-list');
    $('#selection-list li').attr('data-selected', false);
    detectDragging();
}

var addZero = function () {
    //id = B
    var zero = '<li id="B">Zero</li>';
    $(zero).appendTo('#selection-list');
    $('#selection-list li').attr('data-selected', false);
    detectDragging();
}

var changeOrder = function(mode) {
    var option_selection_checked = $('#selection-list li[data-selected="true"]');

    if($('#selection-list li').length > 0) {
      if(mode == "first") {
        option_selection_checked.insertBefore($('#selection-list li:first'));
      }

      if(mode == "up") {
        option_selection_checked.each(function(index,ele) {
          var old_index = $('#selection-list li').index(ele);
          $($('#selection-list li')[old_index - 1]).insertAfter($('#selection-list li')[old_index]);
        });
      }
      
      if(mode == 'down') {
        $(option_selection_checked.get().reverse()).each(function(index, ele) { 
          var old_index = $('#selection-list li').index(ele);
          $($('#selection-list li')[old_index + 1]).insertBefore($('#selection-list li')[old_index]);
        });
      }

      if(mode == "last") {
        option_selection_checked.insertAfter($('#selection-list li:last'));
      }

      checkDisableSort();
    }
}

var getIdArr = function() {
    var idSelection = [];
    if($('#selection-list li').length > 0) {
        $('#selection-list li').each(function (index,opt) {
            idSelection.push(opt.getAttribute('id'));
        })
    }
}

function sortSelectableList() {
    $('#selectable-list li#A, #selectable-list li#B').remove();
    let option_select_default = $('#selectable-list li');
    option_select_default.sort(function(a,b){
        return a.getAttribute('id') - b.getAttribute('id');
    });
    $('#selectable-list').html(option_select_default);
}

function disabledMove() {
    if($('#selectable-list li[data-selected="true"]').length > 0) {
      $('.btn-add').prop('disabled', false);
    } else {
      $('.btn-add').prop('disabled', true);
    }

    if($('#selection-list li[data-selected="true"]').length > 0) {
      $('.btn-remove').prop('disabled', false);
    } else {
      $('.btn-remove').prop('disabled', true);
    }
		return false;
}

function checkDisableSort() {
    var selection = $('#selection-list li');
    var selection_checked = $('#selection-list li[data-selected="true"]');
    
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

function detectDragging() {
  $('.draggable').each(function(ind, ele) {
    $(ele).on('dragstart', function (e) {
      $(ele).addClass('dragging');
    });
    $(ele).on('dragend', function(e) {
      $(ele).removeClass('dragging');
    })
  })
}

$(document).ready(function(){  
  sortSelectableList();

  $('.listbox').mousedown(function(e) {
    if($(e.target).prop("tagName").toLowerCase() === 'li') {
      if($(e.target).attr('data-selected') === 'true') {
        $(e.target).attr('data-selected', false);
      } else {
        $(e.target).attr('data-selected', true);
      }
    }
    // e.preventDefault();
  
    // $(this).children('li').mouseenter(function(e){
    //   console.log($(this).attr('data-selected'));
    //   if(!$(this).attr('data-selected')) {
    //     $(this).attr('data-selected', true);
    //   }
    // });
  });

  $('#selection-list').on('mouseup', function() {
    // $(this).children('li').off('mouseenter');
    $(this).focus().blur();
    checkDisableSort();
    disabledMove();
  });
    
  $('#selectable-list').on('mouseup', function() {
    // $(this).children('li').off('mouseenter');
    $(this).focus().blur();
    disabledMove();
  });
});
