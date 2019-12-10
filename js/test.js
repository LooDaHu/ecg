let dom = document.getElementById("container");
let myChart = echarts.init(dom);
let selectedMarkAreaIndex = [];
let selectedLabelId = null;
let fileNameECG = "";
let option;
// let labelData = [[{id: 1, name: 'Test1', xAxis: 1,}, {xAxis: 3}],
//     [{id: 2, name: 'Test2', xAxis: 11,}, {xAxis: 13}]];
let labelData = [];
let labelDataDisplay = [];
const colorSet = {"A": '#FF0000', "B": '#00FF00', "C": '#0000FF', "": '#808080'};
dom.oncontextmenu = function () {
    return false;
};

document.ondragover = function (e) {
    e.preventDefault();
};
document.ondrop = function (e) {
    e.preventDefault();
};

dom.ondragover = function (e) {
    e.preventDefault();
};

option = {
    title: {
        left: 'center',
        text: "I'm title",
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
        throttleDelay: 1000
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
            // data: [[0, 6], [1, 1], [2, 2], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 10], [9, 15], [10, 12], [11, 13], [12, 9], [13, 8]],
            data: [],
            type: 'scatter'
        },
        {
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',
            // data: [[0, 6], [1, 1], [2, 2], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 10], [9, 15], [10, 12], [11, 13], [12, 9], [13, 8]],
            data: [],

            markArea: {
                name: 'redArea',
                label: {
                    position: 'inside',
                    fontSize: 20,
                    color: '#000000'
                },
                data: labelDataDisplay
            }
        }
    ]
};


/**
 * This part is used to get start index and end index
 * brush part
 */
myChart.on('brushSelected', renderBrushed);

function renderBrushed(params) {
    let brushComponent = params.batch[0];
    let rawIndices = brushComponent.selected[0].dataIndex;
    selectedMarkAreaIndex = [rawIndices[0], rawIndices[rawIndices.length - 1]];
    console.log(selectedMarkAreaIndex);//print start and end index of data point
}

/**
 *  This part is used to get id of labels when click it
 *  click part
 */
myChart.on('click', function (param) {
    // console.log(param);
    let id = param.data.id;
    document.getElementById('selector').innerHTML = 'Current selected Label:' + ' Id=' + id;
    // data.pop();
    selectedLabelId = id;
    // refreshAllLabel();

});


/**
 * This part is used to select file
 * @type {HTMLElement}
 */
let inputElement = document.getElementById("file_selector");
inputElement.addEventListener("change", loadLabelFile, false);

function loadLabelFile() {
    let selectedFile = document.getElementById("file_selector").files[0];//获取读取的File对象
    fileNameECG = selectedFile.name;
    let reader = new FileReader();// read the file
    reader.readAsText(selectedFile);// read the content of the file

    reader.onload = function () {
        let label_data_display = [];
        let result = this.result;
        let json_data = JSON.parse(result).data;
        let size_of_data = json_data.length;
        for (let i = 0; i < size_of_data; i++) {
            let id = json_data[i].id;
            let type = json_data[i].type;
            let start_x = json_data[i]["start_index"];
            let end_x = json_data[i]["end_index"];
            let name = "Label Id: " + id + "\n" + "Label Type: " + type;
            let color = colorSet[type];
            label_data_display.push(
                [{
                    id: id,
                    name: name,
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
        labelData = json_data;
        refreshAllLabel();
    };
}

/**
 * This part is used to save the file
 */
let saveFileButton = document.getElementById("save_file");
saveFileButton.addEventListener("click", saveHandler, false);

function saveHandler() {
    if (fileNameECG === "") {
        window.alert("You have't load any ECG data. Please select one.");
        return;
    }
    let current_time = '_' + get_current_time();
    let file_name = fileNameECG.split('.')[0];
    let content = JSON.stringify({data: labelData});
    let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob, file_name + current_time + ".json");
}

function get_current_time() {
    let date = new Date();
    return date.getFullYear() + "_"
        + date.getMonth() + "_"
        + date.getDate() + "_"
        + date.getHours() + "_"
        + date.getMinutes() + "_"
        + date.getSeconds();
}

/**
 * This part is used to add Label
 */
let btnAddA = document.getElementById("a_add_btn");
btnAddA.addEventListener("click", function () {
    addLabel('A')
}, false);
let btnAddB = document.getElementById("b_add_btn");
btnAddB.addEventListener("click", function () {
    addLabel('B')
}, false);
let btnAddC = document.getElementById("c_add_btn");
btnAddC.addEventListener("click", function () {
    addLabel('C')
}, false);

function addLabel(type) {
    if (selectedMarkAreaIndex.length === 0) {
        window.alert("You haven't select any area. Please select one.");
        return;
    }
    if (selectedMarkAreaIndex[0] === selectedMarkAreaIndex[1]) {
        window.alert("You haven't select any area. Please select one.");
        return;
    }
    let id = getLastId() + 1;
    let color = colorSet[type];
    let start_index = selectedMarkAreaIndex[0];
    let end_index = selectedMarkAreaIndex[1];
    labelDataDisplay.push(
        [{
            id: id,
            name: name,
            xAxis: start_index,
            itemStyle: {
                color: color
            }
        }, {
            xAxis: end_index
        }]
    );
    labelData.push(
        {
            "id": id,
            "type": type,
            "start_index": start_index,
            "end_index": end_index
        }
    );

    selectedMarkAreaIndex = [];
    refreshAllLabel();
}

function getLastId() {
    if (labelData.length === 0) {
        return 0;
    } else {
        return labelData[labelData.length - 1].id;
    }
}


/**
 * This part is used to delete Label
 */
let delLabelButton = document.getElementById("del_btn");
delLabelButton.addEventListener("click", delLabel, false);

function delLabel() {
    if (selectedLabelId == null) {
        window.alert("You haven't select any label. Please select one.");
        return;
    }
    if (labelData.length === 0) {
        window.alert("No label left.");
    }
    for (let i = 0; i < labelData.length; i++) {
        if (labelData[i].id === selectedLabelId) {
            labelData.splice(i, 1);
        }
    }

    for (let i = 0; i < labelDataDisplay.length; i++) {
        if (labelDataDisplay[i][0].id === selectedLabelId) {
            labelDataDisplay.splice(i, 1);
        }
    }

    refreshAllLabel();
    selectedLabelId = null;
    document.getElementById('selector').innerHTML = 'Current selected Label:';
}


/**
 * This part is used to modify Label
 */
let btnModA = document.getElementById("a_select_btn");
btnModA.addEventListener("click", function () {
    modifyLabel('A')
}, false);
let btnModB = document.getElementById("b_select_btn");
btnModB.addEventListener("click", function () {
    modifyLabel('B')
}, false);
let btnModC = document.getElementById("c_select_btn");
btnModC.addEventListener("click", function () {
    modifyLabel('C')
}, false);


function modifyLabel(type) {
    if (selectedLabelId == null) {
        window.alert("You haven't select any label. Please select one.");
        return;
    }
    // console.log(selectedLabelId);
    // console.log(type);

    for (let i = 0; i < labelData.length; i++) {
        if (labelData[i].id === selectedLabelId) {
            labelData[i].type = type;
        }
    }

    for (let i = 0; i < labelDataDisplay.length; i++) {
        if (labelDataDisplay[i][0].id === selectedLabelId) {
            labelDataDisplay[i][0].itemStyle.color = colorSet[type];
        }
    }

    refreshAllLabel();
    selectedLabelId = null;
    document.getElementById('selector').innerHTML = 'Current selected Label:';

}

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
 * Get ECG data
 * @param e
 */
dom.ondrop = function (e) {
    let list = e.dataTransfer.files;
    let f = list[0];
    myChart.showLoading();
    Papa.parse(f, {
        complete: function (results) {
            let data = [];
            for (let i = 0; i < 650000; i++) {
                data.push([i, results.data[0][i]]);
            }
            myChart.hideLoading();
            fileNameECG = f.name;
            myChart.setOption({
                series: [
                    {
                        data: data
                    },
                    {
                        data: data
                    }
                ]
            });
        }
    });
};

if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

/**
 *
 */