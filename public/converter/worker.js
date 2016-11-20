function processFile(file) {
  var reader = new FileReaderSync();
  var text = reader.readAsText(file);
  text.trim().split("\n").forEach(function (experiment, i) { processJSON(JSON.parse(experiment), i) });
}

function processJSON(experiment, i) {
  var columns = Object.keys(experiment.data[0]);
  var csv = [columns.join(",") + "\n"];
  csv = csv.concat(experiment.data.map(function(row) {
    return columns.map(function(field) {
      var v = row[field];
      if (v === undefined) {
        console.log("field " + field + " missing");
        return "";
      } else
        return v.toString();
    }).join(',') + "\n";
  }));
  blob = new Blob(csv, {type: "text/csv"});
  postMessage({csv: blob, name: "experiment" + i});
}

onmessage = function (e) {
  var data = e.data;

  switch(data.action) {
    case "processFile":
      processFile(data.file);
      break;
  };
};