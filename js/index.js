var g_is_mouse_down = false;
var g_slots = ["#flop1", "#flop2", "#flop3", "#turn", "#river"];
var g_suits = ['c', 'd', 'h', 's'];
var g_ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
var g_dead_cards = new Set();
var g_selected_combos = new Set();
var g_selected_hands = new Set();
var g_hand_to_td = {};
var g_selected_suits = {};
var g_fold_range = new Set();
var g_call_range = new Set();
var g_raise_range = new Set();
var g_bluff_range = new Set();
var g_fold_combos = new Set();
var g_call_combos = new Set();
var g_raise_combos = new Set();
var g_bluff_combos = new Set();
var g_treeview_data = [];
var g_treeview = null;
var g_export_file = null;
var g_deck = [];

/**************************** Utils *********************************/

function i2r(num) {
  if (num <= 9) {
    return num.toString()
  }
  return ({
    10: 'T',
    11: 'J',
    12: 'Q',
    13: 'K',
    14: 'A'
  })[num];
}

function r2i(rank) {
  map = {
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
  }
  if (rank in map) {
    return map[rank];
  } else {
    return parseInt(rank);
  }
}

function combo_contains_cards(hand, cards) {
  for (var card of cards) {
    if (hand.includes(card)) {
      return true;
    }
  }
  return false;
}

/**************************** Statistics **************************/

function update_stats() {
  var non_zero_range = Math.min(g_raise_combos.size, 1) + Math.min(g_call_combos.size, 1) + Math.min(g_bluff_combos.size, 1) + Math.min(g_fold_combos.size, 1);
  var total_comobs = null;  
  if (non_zero_range <= 1) {
    total_comobs = 52 * 51 / 2;
  } else {
    total_comobs  = g_raise_combos.size + g_call_combos.size + g_bluff_combos.size + g_fold_combos.size;
  }
  var $bluff = $("span.bluff-stat");
  var $call = $("span.call-stat");
  var $fold = $("span.fold-stat");
  var $raise = $("span.raise-stat");
  $bluff.text(sprintf("%d(%.1f%%)", g_bluff_combos.size,  100.0 * g_bluff_combos.size / total_comobs));
  $call.text(sprintf("%d(%.1f%%)", g_call_combos.size,  100.0 * g_call_combos.size / total_comobs));
  $fold.text(sprintf("%d(%.1f%%)", g_fold_combos.size,  100.0 * g_fold_combos.size / total_comobs));
  $raise.text(sprintf("%d(%.1f%%)", g_raise_combos.size,  100.0 * g_raise_combos.size / total_comobs));
}

/**************************** Driver ******************************/

$(function() {
  draw_table($('#range_matrix'));

  // init mouse status for range selection
  $(document).mouseup(function() {
    g_is_mouse_down = false;
  });

  // initialize deck for random card generation
  for (var card of g_ranks) {
    for (var suit of g_suits) {
      g_deck.push(sprintf('%s%s', card, suit));
    }
  }

  // bind dead card input change event
  clear_dead_cards();
  $("#dead_card_input").change(dead_cards_changed);
  $("#random_dead").click(generate_random_board);

  // bind split suit events
  $("#split_suit_modal").on('click', 'div.suit-combo', suit_combo_clicked);
  $("#split_suit_modal").on('click', '#save_suit', save_selected_suits);
  $("#suit_selection_button").click(split_suit);
  $("#reset_suit_button").click(reset_suit);

  // bind control form events
  $('form.range_assignment').submit(false);
  $("#assign_button").click(assign_range);
  $('#load_button').click(save_load_clicked);
  $("#btn_add_folder").click(add_folder);
  $("#btn_delete_node").click(delete_tree_node);
  $("#btn_save_tree").click(add_range);
  $("#btn_load_range").click(load_range);
  $("#reset_selection_button").click(clear_selected_hands);
  load_treeview();

  // bind persistent events
  $("#toggle_advanced").change(function() {
    $("#persistent_div").toggleClass("hidden");
  });
  $("#export_file").change(export_file_changed);
  $("#download_btn").click(download_db);
  $("#import_btn").click(import_db);
});
