import {Papa} from './PapaParse-5.0.2/papaparse'

let fileInput = './103m.csv';
Papa.parse(fileInput.files[0], {
    complete: function(results) {
        console.log(results);
    }
});