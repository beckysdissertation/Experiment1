function processFile(file) {
  var reader = new FileReaderSync();
  var text = reader.readAsText(file);
  text.trim().split("\n").forEach(function (experiment, i) { processJSON(JSON.parse(experiment), i) });
}

function processJSON(experiment, i) {
  var columns = new Set(Object.keys(experiment.data[0]));
  experiment.data.forEach(function (row) { Object.keys(row).forEach(function (column) { columns.add(column) }) });
  columns = [...columns];
  var csv = [columns.join(",") + "\n"];
  csv = csv.concat(experiment.data.map(function(row) {
    return columns.map(function(field) {
      var v = row[field];
      if (v === undefined) {
        return "";
      } else
        return v.toString();
    }).join(',') + "\n";
  }));

  var friendlyName = null;
  try {
    friendlyName = JSON.parse(experiment.data[0].responses).Q0;
  } catch (e) {}

  blob = new Blob(csv, {type: "text/csv"});
  postMessage({csv: blob, name: "experiment" + i, friendlyName: friendlyName});
}

onmessage = function (e) {
  var data = e.data;

  switch(data.action) {
    case "processFile":
      processFile(data.file);
      break;
  };
};