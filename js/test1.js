let dom = document.getElementById("container");
let myChart;
myChart = echarts.init(dom);
let option;
options = [{
    title: {
        text: '右键菜单',
        textStyle: {
            fontSize: 50
        }
    },
    xAxis: {
        data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    tooltip: {
        show: true
    },
    yAxis: {},
    series: [{
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310]
    }, {
        type: 'bar',
        data: [220, 182, 191, 234, 290, 330, 310]
    }]
}];

//绑定鼠标事件
myChart.on("mousedown", function (e) {
    if (e.event.event.button === 2) {
        //e中有当前节点信息
        showMenu(e, [
            {
                "name": "菜单1",
                "fn": function () {
                    alert("触发-菜单1" + e.data);
                    console.log(e);
                }
            }, {
                "name": "菜单2",
                "fn": function () {
                    alert("触发-菜单2" + e.data);
                }
            }
        ]);
    }
})

var style_ul = "padding:0px;margin:0px;border: 1px solid #ccc;background-color: #fff;position: absolute;left: 0px;top: 0px;z-index: 2;display: none;";
var style_li = "list-style:none;padding: 5px; cursor: pointer; padding: 5px 20px;margin:0px;";
var style_li_hover = style_li + "background-color: #00A0E9; color: #fff;";

//右键菜单容器
var menubox = $("<div class='echartboxMenu' style='" + style_ul + "'><div style='text-align:center;background:#ccc'></div><ul style='margin:0px;padding:0px;'></ul></div>")
    .appendTo($(document.body));

//移除浏览器右键菜单
myChart.getDom().oncontextmenu = menubox[0].oncontextmenu = function () {
    return false;
}

//点击其他位置隐藏菜单
$(document).click(function () {
    menubox.hide()
});

//显示菜单
var showMenu = function (e, menus) {
    $("div", menubox).text(e.name);
    var menulistbox = $("ul", menubox).empty();
    $(menus).each(function (i, item) {
        var li = $("<li style='" + style_li + "'>" + item.name + "</li>")
            .mouseenter(function () {
                $(this).attr("style", style_li_hover);
            })
            .mouseleave(function () {
                $(this).attr("style", style_li);
            })
            .click(function () {
                item["fn"].call(this);
                menubox.hide();
            });
        menulistbox.append(li);
    });
    menubox.css({
        "left": event.x,
        "top": event.y
    }).show();
}