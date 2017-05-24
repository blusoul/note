// javascript 排序算法
// sort


// 冒泡排序
var count = 0;

function bubbleSort1(arr) {
    var i = arr.length,
        j;
    var tempExchangVal;
    while (i > 0) {
        for (j = 0; j < i - 1; j++) {
            count++;
            if (arr[j] > arr[j + 1]) {
                tempExchangVal = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tempExchangVal;
            }
        }
        i--;
    }
    return arr;
}


function bubbleSort(arr) {
    var len = arr.length;
    var temp;
    for (var i = 0; i < len - 1; i++) {
        for (var j = i + 1; j < len; j++) {
            count++;
            if (arr[i] > arr[j]) {
                temp = arr[j];
                arr[j] = arr[i];
                arr[i] = temp;
            }
        }
    }
    return arr;
}

var arr1 = bubbleSort([3, 12, 6, 7, 4, 1, 22, 34, 2, 39]);
console.log(arr1);
console.log(count);

// 选择排序
function chooseSort(arr) {
    if (!arr.length) return false;
    result.push(arr.splice(arr.indexOf(Math.min.apply(null, arr)), 1)[0]);
    return chooseSort(arr);
}

// 插入排序


// 希尔排序


// 归并排序


// 快速排序
var count2 = 0;

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    var middleIndex = Math.floor(arr.length / 2);
    var middleVal = arr.splice(middleIndex, 1);
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        count2++
        if (arr[i] < middleVal) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat(middleVal, quickSort(right));
}

var arr2 = quickSort([3, 12, 6, 7, 4, 1, 22, 34, 2, 39]);
console.log(arr2);
console.log(count2)

// 堆排序


// 计数排序


// 桶排序


// 基数排序


function merge(left, right) {
    var result = [];
    while (left.length > 0 && right.length > 0) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    return result.concat(left).concat(right);

}

function mergeSort(arr) {

    if (arr.length <= 1) {
        return arr;
    }

    var middle = Math.floor(arr.length / 2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle);

    return merge(mergeSort(left), mergeSort(right));

}

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    var pivot = arr.splice(Math.floor(arr.length / 2), 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return quickSort(left).concat([pivot], quickSort(right));
}


function bubbleSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    for (var i = arr.length - 1; i > 0; i--) {
        for (var j = i - 1; j >= 0; j--) {
            if (arr[j] < arr[j - 1]) {
                var tmp = arr[j];
                arr[j] = arr[j - 1];
                arr[j - 1] = tmp;
            }
        }
    }

    return arr;
}

function selectSort(arr) {
    var min, tmp;
    for (var i = 0; i < arr.length; i++) {
        min = i;
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[min] > arr[j]) {
                min = j;
            }
        }
        if (min != i) {
            tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
        }
    }

    return arr;
}

function insertSort(arr) {
    for (var i = 1; i < arr.length; i++) {
        var tmp = arr[i],
            j = i;
        while (arr[j - 1] > tmp) {
            arr[j] = arr[j - 1];
            --j;
        }
        arr[j] = tmp;
    }

    return arr;
}