function export_file_changed() {
  var file_input = this;
  if (!file_input.files) {
    return;
  }
  $("#file_browser_text").text(file_input.files[0].name);
  g_export_file = this;
}

function download_db() {
  var db = localStorage.getItem('treeview');
  
  function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
  }

  download(db, 'solvethestreet_db.json', 'text/plain');
}

function import_db() {
  if (!confirm('import will remove all current ranges, are you sure?')) {
    return;
  }
  
  if (g_export_file == null || !g_export_file.files || !g_export_file.files.length) 
  {
    alert('Please select a file first!');
    return;
  }

  var file = g_export_file.files[0];

  /* Instantiate the File Reader object. */
  var reader = new FileReader();

  /* onLoad event is fired when the load completes. */
  reader.onload = function(event) {
    var content = event.target.result;
    localStorage.setItem('treeview', content);
    // Force update
    g_treeview = null;
    g_treeview_data = null;
    load_treeview();
    alert("Range data import is successful");
  };

  /* The readAsText method will read the file's data as a text string. By default the string is decoded as 'UTF-8'. */
  reader.readAsText(file);  
}
