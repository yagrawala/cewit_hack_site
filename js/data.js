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
        callback(uniqueArray(finalData));
    });
}

function uniqueArray(obj){
    var uniques=[];
    var stringify={};
    for(var i=0;i<obj.length;i++){
       var keys=Object.keys(obj[i]);
       keys.sort(function(a,b) {return a-b});
       var str='';
        for(var j=0;j<keys.length;j++){
           str+= JSON.stringify(keys[j]);
           str+= JSON.stringify(obj[i][keys[j]]);
        }
        if(!stringify.hasOwnProperty(str)){
            uniques.push(obj[i]);
            stringify[str]=true;
        }
    }
    return uniques;
}

var displayDiag = function (d) {
    var toggle = 1;
    d_imp = d.splice(0,5);
    d_imp.forEach(function (data) {
        $('#diag tbody').append('<tr class="odd gradeX">\
                                    <td>' + data.description + '</td>\
                                    <td>' + moment(data.time.replace('T', ' ').replace('Z', ''), 'YYYYMMDD').fromNow() + '</td>\
                                    <td>' + (data.status == 'A'?'Active':'Inactive') + '</td>\
                                </tr>');
    });
    d.forEach( function (data) {
        if (toggle) {
        $('#timeline').append('<li>\
                                    <div class="timeline-badge"><i class="fa fa-gear"></i>\
                                    </div>\
                                    <div class="timeline-panel">\
                                        <div class="timeline-heading">\
                                            <h4 class="timeline-title">' + data.description + '</h4>\
                                            <p><small class="text-muted"><i class="fa fa-clock-o"></i> ' + moment(data.time.replace('T', ' ').replace('Z', ''), 'YYYYMMDD').fromNow() + '</small>\
                                            </p>\
                                        </div>\
                                        <div class="timeline-body">\
                                            <p></p>\
                                        </div>\
                                    </div>\
                                </li>');
        toggle ^= 1;
        }
        else {
        $('#timeline').append('<li class="timeline-inverted">\
                                    <div class="timeline-badge"><i class="fa fa-gear"></i>\
                                    </div>\
                                    <div class="timeline-panel">\
                                        <div class="timeline-heading">\
                                            <h4 class="timeline-title">' + data.description + '</h4>\
                                            <p><small class="text-muted"><i class="fa fa-clock-o"></i> ' + moment(data.time.replace('T', ' ').replace('Z', ''), 'YYYYMMDD').fromNow() + '</small>\
                                            </p>\
                                        </div>\
                                        <div class="timeline-body">\
                                            <p></p>\
                                        </div>\
                                    </div>\
                                </li>');
        toggle ^= 1;
        }
    });

}

var getMedications = function (medicationFile, limit=5, callback) {
     $.getJSON(medicationFile, function (dData) {
        if (dData.hasOwnProperty('drugGroup') && dData.drugGroup.hasOwnProperty('conceptGroup')) {
            var mediData = dData.drugGroup.conceptGroup;
            var finalData = [];
            for (var i = 0; i < mediData.length; i++) {
                if (mediData[i].hasOwnProperty('conceptProperties')) {
                    var medicationData = mediData[i].conceptProperties;
                    medicationData.forEach(function (data) {
                    if (data.hasOwnProperty('synonym')) {
                        finalData.push({
                            'name':data.synonym
                            });
                        }
                    });
                }
            }
            callback(uniqueArray(finalData));
        }
    });
}

var displayMed = function (d) {
    d.forEach(function (data) {
        $('#med tbody').append('<tr class="odd gradeX">\
                                    <td>' + data.name + '</td>\
                                </tr>');
    });
}

$('#search-medications').keypress(function(e) {
    if(e.which == 13) {
        $('#med tbody').empty();
        getMedications('https://rxnav.nlm.nih.gov/REST/drugs.json?name=' + $('#search-medications').val(), 5, displayMed);
    }
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var init = function() {
    $('.page-header')[0].innerHTML = getParameterByName('name');
    if (getParameterByName('id') == 1) {
        getDiagonosis('../js/1.json', 5, displayDiag);
    }
    else if (getParameterByName('id') == 2) {
        getDiagonosis('../js/2.json', 5, displayDiag);
    }
}

$(document).ready(function() {
    init();
});