/********************** Draw Range Matrix ********************/
function update_combos(hand_range, target_combos) {
  target_combos.clear();
  for (var hand of hand_range) {
    var combos = [];
    if (hand.length == 2) { // pocket pair
      var r = hand[0];
      for (var i = 0; i < g_suits.length; i++) {
        for (var j = i+1; j < g_suits.length; j++) {
          var s1 = g_suits[i];
          var s2 = g_suits[j];
          if (hand in g_selected_suits && !g_selected_suits[hand].has(s1 + s2)) {
            continue;
          }
          var combo = sprintf('%s%s%s%s', r, s1, r, s2);
          if (!combo_contains_cards(combo, g_dead_cards)) {
            combos.push(combo);
          }
        }
      }
    } else if (hand[2] == 's') { // suited
      var r1 = hand[0];
      var r2 = hand[1];
      for (var i = 0; i < g_suits.length; i++) {
        var s = g_suits[i];
        if (hand in g_selected_suits && !g_selected_suits[hand].has(s + s)) {
          continue;
        }
        var combo = sprintf('%s%s%s%s', r1, s, r2, s);
        if (!combo_contains_cards(combo, g_dead_cards)) {
          combos.push(combo);
        }
      }
    } else { // offsuit
      var r1 = hand[0];
      var r2 = hand[1];
      for (var i = 0; i < g_suits.length; i++) {
        for (var j = 0; j < g_suits.length; j++) {
          if (j != i) {
            var s1 = g_suits[i];
            var s2 = g_suits[j];
            if ((hand in g_selected_suits) && !g_selected_suits[hand].has(s1 + s2)) {
              continue;
            }
            var combo = sprintf('%s%s%s%s', r1, s1, r2, s2);
            if (!combo_contains_cards(combo, g_dead_cards)) {
              combos.push(combo);
            }
          }
        }
      }
    }
    var $td = g_hand_to_td[hand];
    $("div.combo-num", $td).text(combos.length);
    for (var i = 0; i < combos.length; i++) {
      target_combos.add(combos[i]);
    }
  }
  update_stats();
}

function update_selected_combos() {
  update_combos(g_selected_hands, g_selected_combos);
}

function update_all_combos() {
  $("div.combo-num").text('');
  update_selected_combos();
  update_combos(g_call_range, g_call_combos);
  update_combos(g_fold_range, g_fold_combos);
  update_combos(g_raise_range, g_raise_combos);
  update_combos(g_bluff_range, g_bluff_combos);    
}

function update_selected_combos_from_matrix() {
  var $td = $(this);
  
  var text = $td.contents().not($td.children()).text();
  if ($td.hasClass('selected-hand')) {
    g_selected_hands.add(text);
  } else {
    g_selected_hands.delete(text);
  }
  update_selected_combos();
}


function draw_table($table) {
  for (r = 14; r >= 2; r--) {
    var $tr = $("<tr></tr>")
    for (c = 14; c >= 2; c--) {
      var klass = '';
      if (r > c) {
        var hand = sprintf("%s%ss", i2r(r), i2r(c));
        var combo = 4;
      } else if (r < c) {
        var hand = sprintf("%s%so", i2r(c), i2r(r));
        var combo = 12;
      } else {
        var hand = sprintf("%s%s", i2r(c), i2r(c));
        var combo = 6;
        klass = 'pp'
      }
      var $td = $(sprintf("<td class='%s'>%s<div class='combo-num' original-num=%d></div></td>", klass, hand, combo));
      $td.mousedown(function () {
        g_is_mouse_down = true;
        $(this).toggleClass("selected-hand");
        $(this).trigger('selection-flip');
        return false; // prevent text selection
      }).mouseover(function () {
        if (g_is_mouse_down) {
          $(this).toggleClass("selected-hand");
          $(this).trigger('selection-flip');
        }
      });
      $td.on("selection-flip", update_selected_combos_from_matrix);
      $tr.append($td);
      g_hand_to_td[hand] = $td;
    }
    $table.append($tr);
  }
}
