let dom = document.getElementById("container");
let myChart = echarts.init(dom);
let selectedMarkAreaIndex = [];
let selectedLabelId = null;
let fileNameECG = "";
let option;
let labelData = [];
let labelDataDisplay = [];
let labelSet = {};
const defaultColor = '#808080';

readLabelSetFile("label_setting.json", function(text){
    labelSet = JSON.parse(text);
    labelSetCheck(labelSet);
    labelButtonSetUp(); // Set Dynamic Label buttons
});


/**
 * Disable browser-default on-dragover action
 * @param e
 */
document.ondragover = function (e) {
    e.preventDefault();
};

/**
 * Disable browser-default on-drop action
 * @param e
 */
document.ondrop = function (e) {
    e.preventDefault();
};


/**
 * change browser-default right-click menu to deselect function
 * @param e event
 */
dom.oncontextmenu = function (e) {
    e.preventDefault();
    if (selectedLabelId === null) {
        return;
    }
    deselected();
};

/***
 * Deselect function, deselect current selected label.
 */
function deselected() {
    if (selectedLabelId === null) {
        return; // If No label is selected, then do nothing
    }
    // If some label is selected
    let type = labelDataDisplay[selectedLabelId][0].name; // Get the type of label
    labelDataDisplay[selectedLabelId][0].itemStyle.color = labelSet[type]; // Give the color back to the selected label
    selectedLabelId = null; // reset selected label
    refreshAllLabel(); // refresh all displayed label
}


// Echarts initial option setting here
// Echarts option setting list https://echarts.apache.org/en/option.html#title
option = {
    title: {
        left: 'center',
        text: [],
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            brush: {
                type: ['lineX', 'clear']
            },
        }
    },
    brush: {
        xAxisIndex: 'all',
        brushLink: 'all',
        outOfBrush: {
            colorAlpha: 0.1
        },
        throttleType: 'debounce',
        transformable: false,
        throttleDelay: 500
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    xAxis: {},
    yAxis: {},

    series: [
        {
            id: "point",
            symbolSize: 0,
            data: [],
            type: 'scatter'
        },
        {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            data: [],

            markArea: {
                data: labelDataDisplay
            }
        }
    ]
};


/**
 * This block is for brush tool
 */
// Block Starts
myChart.on('brushSelected', renderBrushed); // Use "on" function to bind brushSelected event https://echarts.apache.org/en/api.html#echartsInstance.on
/**
 * brushSelected handler function
 * @param params params is the return of the event, will be the related values
 */
function renderBrushed(params) {
    let brushComponent = params.batch[0];
    let rawIndices = brushComponent.selected[0].dataIndex; // Get all indices of selected data points
    selectedMarkAreaIndex = [rawIndices[0], rawIndices[rawIndices.length - 1]]; // in the format of [start_index, end_index]
    if (rawIndices.length !== 0) { // if some area is selected, deselect the current selected label
        deselected();
    }
}

// Block Ends

/**
 * This block is for selecting label
 */
// Block Starts
myChart.on('click', function (param) {
    deselected(); // First of first, clear all selected label
    selectedLabelId = param.dataIndex; // Get the dataIndex of the selected label
    labelDataDisplay[selectedLabelId][0].itemStyle.color = '#808080'; // Change the color of the selected label to grey
    refreshAllLabel(); // refresh the display
});
// Block Ends


/**
 * This block is for load label files
 */
// Block Starts
let inputElement = document.getElementById("file_selector");
inputElement.addEventListener("change", loadLabelFile, false);

function loadLabelFile() {
    let selectedFile = document.getElementById("file_selector").files[0];
    let file_name_label = document.getElementById("file_name_label");
    if (!extensionNameCheck(selectedFile.name)) {
        window.alert("The format of label data file is not correct !");
        return;
    }
    file_name_label.innerHTML = selectedFile.name;
    Papa.parse(selectedFile, { //Use Papaparse to parse label_file.csv
        complete: function (results) {
            let csv_data = results.data;
            let size_of_data = results.data.length;
            let label_data_display = [];
            for (let i = 1; i < size_of_data; i++) {
                let start_x = csv_data[i][0];
                let end_x = csv_data[i][1];
                let type = csv_data[i][2];
                let color = labelSet[type];
                label_data_display.push(
                    [{
                        name: type,
                        xAxis: start_x,
                        itemStyle: {
                            color: color
                        }
                    }, {
                        xAxis: end_x
                    }]
                );
            }
            labelDataDisplay = label_data_display;
            csv_data.shift();
            labelData = csv_data;
            refreshAllLabel();
        }
    });

}

// Block Ends

/**
 * This block is for saving labels into CSV file
 */
// Block Starts
let saveFileButton = document.getElementById("save_file");
saveFileButton.addEventListener("click", saveHandler, false);

function saveHandler() {
    if (fileNameECG === "") {
        window.alert("You have't load any ECG data. Please select one.");
        return;
    }
    let label_data = labelData.concat();
    label_data.unshift(["start_index", "end_index", "type"]);
    let current_time = '_' + get_current_time();
    let file_name = fileNameECG.split('.')[0];
    let csvData = label_data.map(e => e.join(",")).join("\n");
    let BOM = "\uFEFF";
    csvData = BOM + csvData;
    let blob = new Blob([csvData], {type: "text/csv;charset=utf-8"});
    saveAs(blob, file_name + current_time + ".csv");
}

function get_current_time() {
    let date = new Date();
    return date.getFullYear() + "_"
        + (date.getMonth() + 1) + "_"
        + date.getDate() + "_"
        + date.getHours() + "_"
        + date.getMinutes() + "_"
        + date.getSeconds();
}

// Block Ends


/**
 * This block is for Add-Button setting
 */
// Block Starts
function labelButtonSetUp() {
    let label_btn_grp = document.getElementById("label-btn-grp");
    Object.keys(labelSet).forEach(function (type) {
        let label_btn = document.createElement("button");
        label_btn.id = type + "_label_btn";
        label_btn.innerHTML = type + "-Label";
        label_btn.addEventListener("click", function () {
            addLabel(type) //change here
        }, false);
        label_btn.style.marginRight = "15px";
        label_btn.style.fontWeight = "bold";
        label_btn.style.backgroundColor = labelSet[type];
        label_btn.style.borderColor = labelSet[type];
        label_btn.style.color = '#000000';
        label_btn.className = "btn btn-primary";
        label_btn_grp.append(label_btn);
    });
}

// Block Ends

/**
 * Add-labels function
 * @param type the type of labels
 */
function addLabel(type) {
    if (selectedMarkAreaIndex.length === 0) {
        window.alert("You haven't select any area. Please select one.");
        return;
    }
    if (selectedMarkAreaIndex[0] === selectedMarkAreaIndex[1]) {
        window.alert("You haven't select any area. Please select one.");
        return;
    }
    let color = labelSet[type];
    let start_index = selectedMarkAreaIndex[0];
    let end_index = selectedMarkAreaIndex[1];
    labelDataDisplay.push( // Push display data into display data array
        [{
            name: type,
            xAxis: start_index,
            itemStyle: {
                color: color
            }
        }, {
            xAxis: end_index
        }]
    );

    labelData.push([start_index, end_index, type]); // Push data into data array
    selectedMarkAreaIndex = [];
    refreshAllLabel();
}

/**
 * This block is for Delete-Button setting
 */
// Block Starts
let delLabelButton = document.getElementById("del_btn");
delLabelButton.addEventListener("click", delLabel, false);

// Block Ends

/**
 * Delete-labels function
 */
function delLabel() {
    if (selectedLabelId == null) {
        window.alert("You haven't select any label. Please select one.");
        return;
    }
    if (labelData.length === 0) {
        window.alert("No label left.");
    }
    labelData.splice(selectedLabelId, 1);
    labelDataDisplay.splice(selectedLabelId, 1);
    refreshAllLabel();
    selectedLabelId = null;
}

/**
 * Refresh-labels function
 */
function refreshAllLabel() {
    myChart.setOption({
        series: [
            {},
            {
                markArea: {
                    data: labelDataDisplay
                }
            }
        ]
    });
}

/**
 * Get ECG data from ecg_data.csv, and display the data
 * @param e
 */
dom.ondrop = function (e) {
    let list = e.dataTransfer.files;
    let f = list[0];
    if (!extensionNameCheck(f.name)) {
        window.alert("The format of ECG data file is not correct !");
        return;
    }
    myChart.showLoading();
    Papa.parse(f, {
        complete: function (results) {
            let data = [];
            for (let i = 0; i < results.data.length; i++) {
                data.push([i, results.data[i][0]]);
            }
            fileNameECG = f.name;
            myChart.setOption({
                title: {
                    text: fileNameECG
                },
                series: [
                    {
                        data: data
                    },
                    {
                        data: data
                    }
                ]
            });
            myChart.hideLoading();
        }
    });
};

/**
 * extension name check function
 * @param file_name
 * @returns {boolean} Return false if match, else return true
 */
function extensionNameCheck(file_name) {
    let csv_extension_name = "csv";
    let index = file_name.lastIndexOf(".");
    let ext = file_name.substr(index + 1);
    return ext === csv_extension_name;
}

/**
 * Check if the label set is appropriate
 * @param labelSetting Global label set
 */
function labelSetCheck(labelSetting) {
    let reg_color = /^[#][0-9a-fA-F]{6}$/;
    // let reg_type = /^[a-zA-Z]+$/;
    for (let type in labelSetting) {
        if(labelSetting.hasOwnProperty(type)){
            if (type === '') {
                window.alert("The type of label can't be empty string !");
            }
            if (!reg_color.test(labelSetting[type])) {
                window.alert("Invalid Color Format !");
            }
            if (labelSetting[type] === '#808080') {
                window.alert("#808080 is not recommended as label color !");
            }
        }
    }
}

function readLabelSetFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}


if (option && typeof option === "object") {
    myChart.setOption(option, true);
}
