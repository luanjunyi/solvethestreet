/********************  Tree Serialization/Restore **********************/
function load_treeview() {
  if ('treeview' in localStorage) {
    g_treeview_data = JSON.parse(localStorage.getItem('treeview'));
  } else {
    g_treeview_data = [
      {
        title: 'ALL',
        folder: true,
        expanded: true,
        key: 'root'
      }
    ];
  }
}

function save_tree() {
  var tree = extract_tree_data(g_treeview.getRootNode());
  var json = JSON.stringify(tree);
  localStorage.setItem('treeview', json);
}

function extract_tree_data(root) {
  function search(node) {
    var children = [];
    if ('children' in node && node.children != null && node.children.length > 0) {
      for (var child of node.children) {
        var child_data = search(child);
        children.push(child_data);
      }
    }
    var cur = {
      title: node.title,
      folder: node.isFolder(),
      key: node.key,
      data: node.data,
      children: children
    };
    if (cur.title == 'ALL') {
      cur['expanded'] = true;
    }
    return cur;
  }
  return search(root);
}

/********************  Solution Serialization/Restore **********************/

function serialize_solution() {
  var suits = Object.assign({}, g_selected_suits);
  for (var hand in suits) {
    suits[hand] = Array.from(suits[hand]);
  }
  var solution = {
    'fold': Array.from(g_fold_range),
    'call': Array.from(g_call_range),
    'raise': Array.from(g_raise_range),
    'bluff': Array.from(g_bluff_range),
    'suits': suits,
    'dead': Array.from(g_dead_cards)
  }

  return JSON.stringify(solution);
}

function restore_ui() {
  // Restore dead card UI
  slot_idx = 0;
  cards = [];
  for (var card of g_dead_cards) {
    cards.push(card);
    card = card.toUpperCase();
    filename = sprintf("img/cards/%s.png", card);
    load_dead_card_img($(g_slots[slot_idx]), filename);
    slot_idx++;
  }
  while (slot_idx < 5) {
    load_dead_card_img($(g_slots[slot_idx]), 'img/cards/back.png');
    slot_idx++;
  }
  $("#dead_card_input").val(cards.join(','));
  // Restore ranges in matrix
  function clear_td($td) {
    $td.removeClass('call-range');
    $td.removeClass('fold-range');
    $td.removeClass('raise-range');
    $td.removeClass('bluff-range');    
  }
  $("#range_matrix td").each(function(i, e) {
    clear_td($(e));
  });
  for (var hand of g_call_range) {
    var $td = g_hand_to_td[hand];
    clear_td($td);
    $td.addClass('call-range');
  }
  for (var hand of g_fold_range) {
    var $td = g_hand_to_td[hand];
    clear_td($td);
    $td.addClass('fold-range');
  }
  for (var hand of g_raise_range) {
    var $td = g_hand_to_td[hand];
    clear_td($td);
    $td.addClass('raise-range');
  }
  for (var hand of g_bluff_range) {
    var $td = g_hand_to_td[hand];
    clear_td($td);
    $td.addClass('bluff-range');
  }  
}

function load_from_json(json) {
  var solution = JSON.parse(json);
  g_fold_range = new Set(solution.fold);
  g_call_range = new Set(solution.call);
  g_raise_range = new Set(solution.raise);
  g_bluff_range = new Set(solution.bluff);
  var suits = solution.suits;
  for (var hand in suits) {
    suits[hand] = new Set(suits[hand]);
  }
  g_selected_suits = solution.suits;
  g_dead_cards = new Set(solution.dead);
  update_all_combos();
  restore_ui();
}

function load_range() {
  var node = g_treeview.getActiveNode();
  if (node.isFolder()) {
    console.log("can't load range from a folder");
    return;
  }
  var json = node.data.solution;
  load_from_json(json);
  $('#load_save_modal').modal('hide'); 
}

/********************** Controls *****************************/

function add_folder() {
  var parent = g_treeview.getActiveNode();
  if (parent === null) {
    parent = g_treeview.getNodeByKey('root');
  }
  var folder_name = $("#range_name").val();
  if (folder_name.length == 0) {
    folder_name = 'NEW FOLDER';
  }
  var key = folder_name.toLowerCase().replace(' ','-');
  
  parent.addChildren({
    title: folder_name,
    folder: true,
    expanded: true,
    key: key
  });

  $("#range_name").val('');
  save_tree();
}

function add_range() {
  var solution_json = serialize_solution();
  
  var parent = g_treeview.getActiveNode();
  if (parent === null) {
    parent = g_treeview.getNodeByKey('root');    
  }

  if (!parent.isFolder()) {
    var overwrite = confirm("Overwrite " + parent.title + "?");
    if (overwrite) {
      parent.data = {
        'solution': solution_json
      }
    }
  } else {
    var range_name = $("#range_name").val();
    if (range_name.length == 0) {
      range_name = 'NEW RANGE';
    }
    var key = range_name.toLowerCase().replace(' ','-');

    parent.addChildren({
      title: range_name,
      folder: false,
      key: key,
      data: {'solution': solution_json}
    });
    parent.setExpanded(true);
    $("#range_name").val('');
  }
  save_tree();
}

function delete_tree_node() {
  var node = g_treeview.getActiveNode();
  if (node === null) {
    return;
  }

  if (confirm("Will delete " + node.title + "?")) {
    node.remove();
    save_tree();
  }
}

function save_load_clicked() {
  if (g_treeview === null) {
    g_treeview = $("#treeview").fancytree({
      extensions: ['edit', 'dnd'],
      source: g_treeview_data,
      dnd: {
        // Available options with their default:
        autoExpandMS: 400,   // Expand nodes after n milliseconds of hovering
        draggable: null,      // Additional options passed to jQuery UI draggable
        droppable: null,      // Additional options passed to jQuery UI droppable
        dropMarkerOffsetX: -24,  // absolute position offset for .fancytree-drop-marker
        // relatively to ..fancytree-title (icon/img near a node accepting drop)
        dropMarkerInsertOffsetX: -16, // additional offset for drop-marker with hitMode = "before"/"after"
        focusOnClick: true,  // Focus, although draggable cancels mousedown event (#270)
        preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
        preventVoidMoves: true,      // Prevent dropping nodes 'before self', etc.
        smartRevert: true,    // set draggable.revert = true if drop was rejected

        // Events that make tree nodes draggable
        dragStart: function() { return true; },      // Callback(sourceNode, data), return true to enable dnd
        dragStop: null,
        initHelper: null,     // Callback(sourceNode, data)
        updateHelper: null,   // Callback(sourceNode, data)

        // Events that make tree nodes accept draggables
        dragEnter: function() { return true; },      // Callback(targetNode, data)
        dragExpand: function() { return true; },     // Callback(targetNode, data), return false to prevent autoExpand
        dragOver: null,       // Callback(targetNode, data)
        dragDrop: function(node, data) {
          data.otherNode.moveTo(node, data.hitMode);
          save_tree();
        },
        dragLeave: null       // Callback(targetNode, data)        
      }
    }).fancytree("getTree");
  }
  $('#load_save_modal').modal();
}
