var getDiagonosis = function (diagonosisFile, limit=5, callback) {
     $.getJSON(diagonosisFile, function (dData) {
        var diagonosisData = dData.Diagnoses.Diagnosis;
        var finalData = [];
        diagonosisData.forEach(function (data) {
            if (data.hasOwnProperty('Diagnosis') && data.hasOwnProperty('EnteredOn') && data.hasOwnProperty('Status')) {
                var diagData = data.Diagnosis;
                if (diagData.hasOwnProperty('Description')) {
                    finalData.push({
                    'description':diagData.Description,
                    'time': data.EnteredOn,
                    'status': data.Status.Description
                    });
                }
            }
        });
        callback(finalData.slice(0, limit));
    });
}

var displayDiag = function (d) {
    d.forEach(function (data) {
        $('#diag tbody').append('<tr class="odd gradeX">\
                                    <td>' + data.description + '</td>\
                                    <td>' + data.time + '</td>\
                                    <td>' + data.status + '</td>\
                                </tr>');
    });
}

getDiagonosis('../js/diagnosis.json', 5, displayDiag);