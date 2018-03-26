/*********************** Split Suit **************************/

function suit_combo_clicked() {
  var $suit_div = $(this);
  $suit_div.toggleClass("selected-suit");
}

function split_suit() {
  var $td = $("td.selected-hand").first();
  var hand = $td.contents().not($td.children()).text();
  var type = '';
  var $modal = $("#split_suit_modal");
  if (hand.length == 2) {
    type = 'p';
  } else {
    type = hand[2];
  }
  if (type == 'p') { // pocket pair
    var body = $("#pair_split_suit").html();
    $("div.modal-body", $modal).html(body);
    
  } else if (type == 's') { // suited
    var body = $("#suited_split_suit").html();
    $("div.modal-body", $modal).html(body);

  } else { // offsuit
    var body = $("#offsuit_split_suit").html();
    $("div.modal-body", $modal).html(body);
  }
  // load selected suits
  $("div.suit-combo", $("div.modal-body", $modal)).each(function() {
    var key = $(this).data('suit');
    if (hand in g_selected_suits && g_selected_suits[hand].has(key)) {
      $(this).addClass('selected-suit');
    } else {
      $(this).removeClass('selected-suit');
    }
  });
  $modal.modal();
  return false;
}

function save_selected_suits() {
  var $td = $("td.selected-hand");
  var hands = $td.map(function(idx, elem) {
    return $(elem).contents().not($(elem).children()).text();
  })
  var suits = new Set();
  var $body = $(".modal-body", $("#split_suit_modal"));
  for (var suit of $("div.suit-combo", $body)) {
    if ($(suit).hasClass("selected-suit")) {
      var suit_combo = $(suit).data("suit");
      suits.add(suit_combo);
    }
  }
  for (var hand of hands) {
    if (suits.size == 0) {
      delete g_selected_suits[hand];
    } else {
      g_selected_suits[hand] = suits;
    }
  }
  update_all_combos();
  $body.empty();
  $("#split_suit_modal").modal('hide');
}

function reset_suit() {
  if (confirm("Will clear all suit selection, are you sure?")) {
    g_selected_suits = {};
    update_all_combos();
  }
  return false;
}
