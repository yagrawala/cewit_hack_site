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

var getMedications = function (query, medicationFile, limit=5, callback) {
    if (query != 'Morphine') return;
     $.getJSON(medicationFile, function (dData) {
        var medicationData = dData.drugGroup.conceptGroup[2].conceptProperties;
        var finalData = [];
        medicationData.forEach(function (data) {
            if (data.hasOwnProperty('synonym')) {
                finalData.push({
                    'name':data.synonym
                });
            }
        });
        callback(finalData.slice(0, limit));
    });
}

var displayMed = function (d) {
    d.forEach(function (data) {
        $('#med tbody').append('<tr class="odd gradeX">\
                                    <td>' + data.name + '</td>\
                                </tr>');
    });
}


getDiagonosis('../js/diagnosis.json', 5, displayDiag);

$('#search-medications').keypress(function(e) {
    if(e.which == 13) {
        $('#med tbody').empty();
        getMedications($('#search-medications').val(), '../js/medications.json', 5, displayMed);
    }
});