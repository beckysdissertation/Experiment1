function processFile(file) {
  var reader = new FileReaderSync();
  var experiment = JSON.parse(reader.readAsText(file));
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
  return new Blob(csv, {type: "text/csv"});
}

onmessage = function (e) {
  var data = e.data;

  switch(data.action) {
    case "processFile":
      var csv = processFile(data.file);
      postMessage({csv: csv});
      break;
  };
};