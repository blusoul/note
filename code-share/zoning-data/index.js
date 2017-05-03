;
(function () {
    // 国家统计局数据
    var url = 'http://www.mca.gov.cn/article/sj/tjbz/a/2017/0327/2017%E5%B9%B42%E6%9C%88%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E5%8E%BF%E4%BB%A5%E4%B8%8A%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%88%92%E4%BB%A3%E7%A0%81.html';
    var nodeList = Array.from(document.querySelectorAll('tbody tr'));
    var listJSON = {};
    var provinceCode;
    var cityCode;

    // 设置市一级代码
    function setCityCode(zoningCode, tempStr) {
        listJSON[provinceCode].list[zoningCode] = {};
        listJSON[provinceCode].list[zoningCode].name = tempStr;
        listJSON[provinceCode].list[zoningCode].list = {};
    }

    nodeList.map(function (item) {
        var tdList = item.querySelectorAll('td');
        if (tdList[1]) {
            var zoningCode = tdList[1].innerHTML.trim();
            var tempStr;
            // 区划代码为数字
            if (/^\d{6}$/.test(zoningCode)) {
                tempStr = tdList[2].innerText.trim();
                if (zoningCode.substr(-4) == 0) {
                    // 省区划代码最后四位都是 0 比如： 130000 河北省 
                    listJSON[zoningCode] = {};
                    listJSON[zoningCode].name = tempStr;
                    listJSON[zoningCode].list = {};
                    // 省区划代码作为 key
                    provinceCode = zoningCode;
                    // 当为北京，天津，上海，重庆四个直辖市，复制一份作为市一级
                    if (/(110000|120000|310000|500000)/.test(provinceCode)) {
                        cityCode = zoningCode;
                        setCityCode(zoningCode, tempStr);
                    }
                } else if (zoningCode.substr(-2) == 0) {
                    // 市级区划代码最后两位都是 0 比如： 130100 石家庄市
                    cityCode = zoningCode;
                    setCityCode(zoningCode, tempStr);
                } else {
                    if (zoningCode.charAt(2) == 9) {
                        // 省直辖县级行政区划 或 自治区直辖县级行政区划 的代码 第三位为 9 比如 659001 石河子市 429004 仙桃市
                        // 此类市没有下一级目录，需要自己添加
                        setCityCode(zoningCode, tempStr);
                    } else {
                        listJSON[provinceCode].list[cityCode].list[zoningCode] = {};
                        listJSON[provinceCode].list[cityCode].list[zoningCode].name = tempStr;
                    }
                }
            }
        }
    });
    console.log(JSON.stringify(listJSON));
})();