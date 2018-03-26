/***************************** Dead Card Logic *********************/

function clear_dead_cards() {
  g_dead_cards.clear();
  for (var i = 0; i < g_slots.length; i++) {
    $(g_slots[i]).attr('src', 'img/cards/back.png');
  }
}

function load_dead_card_img($img, img_file) {
  $img.attr('src', img_file);
}

function get_removed_combos(rank, suit) {
  ret = [];
  for (var i = 0; i < g_ranks.length; i++) {
    var r = g_ranks[i];
    for (var j = 0; j < g_suits.length; j++) {
      var s = g_suits[j];
      if (r == rank && s == suit) {
        continue;
      }
      if (g_dead_cards.has(sprintf("%s%s", r, s))) {
        continue;
      }
      if (r == rank) {
        if (s < suit) {
          var combo = sprintf("%s%s%s%s", r, s, rank, suit);
        } else {
          var combo = sprintf("%s%s%s%s", r, suit, rank, s);
        }
      } else if (r2i(r) > r2i(rank)) {
        var combo = sprintf("%s%s%s%s", r, s, rank, suit);
      } else {
        var combo = sprintf("%s%s%s%s", rank, suit, r, s);
      }
      ret.push(combo);
    }
  }
  return ret;
}

function remove_dead_cards_from_range() {
  for (var card of g_dead_cards) {
    var r = card[0];
    var s = card[1];

    combos = get_removed_combos(r, s);
    for (var combo of combos) {
      var r1 = combo[0];
      var s1 = combo[1];
      var r2 = combo[2];
      var s2 = combo[3];
      if (r1 == r2) {
        var key = sprintf('%s%s', r1, r2);
      } else if (s1 == s2) {
        var key = sprintf('%s%ss', r1, r2);
      } else {
        var key = sprintf('%s%so', r1, r2);
      }
    }
  }
  update_all_combos();
}

function dead_cards_changed() {
  clear_dead_cards();
  var text = $(this).val();
  var cards = text.split(',');
  
  var slot_idx = 0;
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i].trim();
    if (card.length == 0) {
      continue;
    }
    card = card.toUpperCase();
    g_dead_cards.add(card[0] + card[1].toLowerCase());
    filename = sprintf("img/cards/%s.png", card);
    load_dead_card_img($(g_slots[slot_idx]), filename);
    slot_idx++;
  }
  remove_dead_cards_from_range();
}

function generate_random_board() {
  if (g_dead_cards.size >= 5) {
    return;
  }
  while (true) {
    var card = g_deck[Math.floor(Math.random() * g_deck.length)];
    if (g_dead_cards.has(card)) {
      continue;
    }
    g_dead_cards.add(card);
    break;
  }
  
  $('#dead_card_input').val(Array.from(g_dead_cards).join(","));
  $('#dead_card_input').change();
}
