# ECG Label System
ECG Label System is a visualization and label-creating software for the ECG dataset. It is writen in ![HTML5](https://www.w3.org/html/logo/badge/html5-badge-h-css3.png "HTML5 w/ CSS3") and <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/240px-JavaScript-logo.png" width="75" alt="JavaScript" title="JavaScript">

This project is powered by:
* [**Echarts**](https://github.com/apache/incubator-echarts)
* [**Papa parse 5**](https://github.com/mholt/PapaParse)
* [**FileSaver.js**](https://github.com/eligrey/FileSaver.js/)
* [**BootStrap 4**](https://github.com/twbs/bootstrap)
* [**Font Awesome**](https://fontawesome.com/)



## Motivation
[**Supervised learning** is the machine learning task of learning a function that maps an input to an output based on example input-output pairs. It infers a function from labeled training data consisting of a set of training examples. In supervised learning, each example is a pair consisting of an input object (typically a vector) and a desired output value (also called the supervisory signal).](https://en.wikipedia.org/wiki/Supervised_learning)<br><br>
This software is aiming to help the related specialists to use their knowledge to create labeled training data that can be used in supervised learning. 

## Data Format ?
Both ECG data and label data are the CSV file.
### ECG data
ECG data come from MIT-BIH database. A data file contains 650K sampling points. This is the format of ECG_data.csv:
```
-29
-29
-29
.
.
.
-135
-153
-256
```
A data file has one column and 650K rows. And sampling points are arranged from top to bottom in the order of time.
For the example of ECG data, Check [here](https://github.com/LooDaHu/ecg/tree/master/dataset).
### Label data
There are three column in label data file, start_index, end_index, type. This is the format of Label_data.csv:
```
start_index,end_index,type
1515,1525,Q
1388,1465,R
1588,1631,S
1229,1244,Q
```
For the example of Label data, Check [here](https://github.com/LooDaHu/ecg/tree/master/fake_label_data_set).

## How to Use ?
This is a simple video to introduce how to use.<br>
[![Intro to ECG Label Sys](https://img.youtube.com/vi/p2C38xatN_c/0.jpg)](https://youtu.be/p2C38xatN_c)
## Use it on Github
[Click Me !](https://loodahu.github.io/ecg/ecg_index.html)
## I don't want those labels, No worry !
It's possible for you to change the Label. Just need you to modify labelSet variable in [ecg,js](https://github.com/LooDaHu/ecg/blob/master/js/ecg.js) 
```
{
  "Q": "#FF00F0",
  "R": "#00F0FF",
  "S": "#F0FF00",
  "P": "#FF7F24",
  "T": "#ADFF2F"
}
```
The key is the names of labels and values are color in 256-color format. Just change those values and you can get the labels you want.
Note:
1) Empty label is no recommended.
2) #808080 is not recommended as a label color due to the conflict with the brush tool.
3) Once the label setting has changed, old label data files can not be used in the new system.
## Special Thanks
Thanks for [Dr.Toby Hocking](https://github.com/tdhock)'s help and advice to make this project completed.


