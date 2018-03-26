/*********** Assign current seletion to a range **************/

function clear_selected_hands() {
  $("td.selected-hand").removeClass("selected-hand");
  g_selected_hands.clear();
  update_selected_combos();
}

function assign_range() {
  var target = $("#assign_target option:selected").data('range');
  
  $("td.selected-hand").each(function() {
    var hand = $(this).contents().not($(this).children()).text();    
    g_call_range.delete(hand);
    g_raise_range.delete(hand);    
    g_fold_range.delete(hand);
    g_bluff_range.delete(hand);
    $(this).removeClass('call-range');
    $(this).removeClass('fold-range');
    $(this).removeClass('raise-range');
    $(this).removeClass('bluff-range');    
  });
  
  if (target != 'remove') {
    $("td.selected-hand").each(function() {
      $(this).addClass(target + "-range");
      var hand = $(this).contents().not($(this).children()).text();
      if (target == 'call') {
        g_call_range.add(hand);
      } else if (target == 'fold') {
        g_fold_range.add(hand);
      } else if (target == 'bluff') {
        g_bluff_range.add(hand);
      } else {
        console.assert(target == 'raise');
        g_raise_range.add(hand);
      }
    });
  }

  clear_selected_hands();
  update_all_combos();
  return false;
}

