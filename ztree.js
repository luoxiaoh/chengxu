
var pageX = '',pageY = '';
$(window).on('mouseup',function(e){
    pageX = e.pageX,pageY = e.pageY;
});
var zTreeObj;
// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）

var setting = {
    check: {
        enable: false
    },
    view : {
        selectedMulti: false,
        showIcon: true,  //设置是否显示节点图标
        showLine: true  //设置是否显示节点与节点之间的连线
        // fontCss: setFontCss
    },
    async: {
        enable: false, // 设置 zTree是否开启异步加载模式  加载全部信息
        url: "", // Ajax 获取数据的 URL 地址
        autoParam: [],    // 异步加载时自动提交父节点属性的参数,假设父节点 node = {id:1, name:"test"}，异步加载时，提交参数 zId=1
        dataFilter: filter
    },

    callback: {
        onExpand: onExpand
    }
};
function Xtree(Ttype) {
    $.ajax({
        type: "POST",
        url: basepath+"/tree/config/child",
        data: {treeType:Ttype},
        dataType:"json",
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        async:false,
        success: function(data){
            var init = {
                name:'华北电网',
                children:data,
                open:true
            };
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, init);
        }
    })
}

//解决出现undifined
function  filter() {};
// 拖拽

function add0(m){return m<10?'0'+m:m }
function getDate(nS){
    var time = new Date(nS);
    var m = time.getMonth()+1;
    var y = time.getFullYear();
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm);
}

function onExpand(event, treeId, treeNode) {
    if(treeNode.children!=undefined && treeNode.children.length>0) {
        return;
    }
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var node = treeObj.getNodeByTId(treeNode.tId);
    $.ajax({
        type: "POST",
        async: false,
        url: basepath+"/tree/config/child",
        data: {
            serial: treeNode.serial,
            data: JSON.stringify(treeNode),
            treeType: TreeType
        },
        dataType: "json",
        success: function (data) {
            if (data != null && data != "") {
                for(var i=0;i<data.length;i++){
                    //添加新节
                    if (data[i].tableName==undefined) {
                        data[i].icon = './css/zTreeStyle/Grid-model/icon_folder.png';
                    } else if (data[i].tableName=='ps_analog'){
                        data[i].icon = './css/zTreeStyle/Grid-model/drag.png';
                    }else if (data[i].tableName =='ps_substation'){
                        // 变电站
                        if (data[i].type == "风电场"){
                            data[i].icon = './css/zTreeStyle/Grid-model/PowerPlant_500.png';
                        }else if (data[i].type == "火电厂"){
                            data[i].icon = './css/zTreeStyle/Grid-model/PowerPlant_1000.png';
                        }else if (data[i].type == "抽水蓄能站" || data[i].type == "水电厂"){
                            data[i].icon = './css/zTreeStyle/Grid-model/PowerPlant_220.png';
                        }else if(data[i].type =='变电站'){
                            if(data[i].baseVoltage =='220kV'){
                                data[i].icon = './css/zTreeStyle/Grid-model/substation_220.png';
                            }else if(data[i].baseVoltage =='500kV'){
                                data[i].icon = './css/zTreeStyle/Grid-model/substation_500.png';
                            }else if(data[i].baseVoltage =='110kV'){
                                data[i].icon = './css/zTreeStyle/Grid-model/substation_110.png';
                            }else if(data[i].baseVoltage =='1000kV'){
                                data[i].icon = './css/zTreeStyle/Grid-model/substation.png';
                            }
                        }else if(data[i].type =='换流站'){
                            data[i].icon = './css/zTreeStyle/Grid-model/ConverterStation1_1000.png';
                        }else{
                            if(data[i].baseVoltage=='DC800kV' || data[i].baseVoltage=='800kV' || data[i].baseVoltage=='DC660kV' || data[i].baseVoltage=='600kV')
                            data[i].icon = './css/zTreeStyle/Grid-model/ConverterStation1_1000.png';
                        }
                    } else if(data[i].tableName =='ps_busbarsection'){
                        //  母线
                        data[i].icon = './css/zTreeStyle/Grid-model/generatrix_500.png';
                    } else if(data[i].tableName =='ps_breaker'){
                        //  开关
                        switch (data[i].parent.baseVoltage)
                        {
                            case '35kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/switch_35.png';
                                break;
                            case '220kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/switch_220.png';
                                break;
                            case '500kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/switch_500.png';
                                break;
                            default :
                                data[i].icon = './css/zTreeStyle/Grid-model/switch_500.png';
                                break;
                        }
                    } else if(data[i].tableName == 'ps_disconnector'){
                        //  刀闸
                        data[i].icon = './css/zTreeStyle/Grid-model/reactor_110.png';
                    } else if (data[i].tableName == 'ps_synchronousmachine'){
                        //  发电机
                        data[i].icon = './css/zTreeStyle/Grid-model/Alternator_35.png';
                    } else if (data[i].tableName == "ps_bay"){
                        //  间隔
                        data[i].icon = './css/zTreeStyle/Grid-model/breaker_220.png';
                    } else if(data[i].tableName == "ps_aclinesegment"){
                        //  线路
                        switch (data[i].parent.baseVoltage)
                        {
                            case '220kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/line_220.png';
                                break;
                            case '500kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/line_500.png';
                                break;
                            case '330kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/line_330.png';
                                break;
                            default :
                                data[i].icon = './css/zTreeStyle/Grid-model/line_1000.png';
                                break;
                        }
                    }else if(data[i].tableName === 'ps_aclinedot'){
                        // 线路
                        switch (data[i].parent.baseVoltage)
                        {
                            case '220kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/line_220.png';
                                break;
                            case '500kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/line_500.png';
                                break;
                            case '330kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/line_330.png';
                                break;
                            default :
                                data[i].icon = './css/zTreeStyle/Grid-model/line_1000.png';
                                break;
                        }

                    }else if (data[i].tableName == "ps_transformerwinding"){
                        //  变压器 ps_transformerwinding// ps_powertransformer
                        if (data[i].type==='三绕变'){
                            data[i].icon = './css/zTreeStyle/Grid-model/ThreeWindingTransformer_500_35_220.png';
                        }else if(data[i].type==='二绕变'){
                            data[i].icon = './css/zTreeStyle/Grid-model/TwoWindingTransformer_220_35.png';
                        }
                    } else if(data[i].tableName == 'ps_powertransformer'){
                        // 变压器(按三绕)
                        if (data[i].type==='三绕变'){
                            data[i].icon = './css/zTreeStyle/Grid-model/ThreeWindingTransformer_220_10_110.png';
                        }else if(data[i].type==='二绕变'){
                            data[i].icon = './css/zTreeStyle/Grid-model/ThreeWindingTransformer_500_35_220.png';
                        }

                    } else if (data[i].tableName == "ps_shuntcompensator"){
                        // 电容 电抗
                        switch (data[i].parent.baseVoltage)
                        {
                            case '35kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/capacitor_35.png';
                                break;
                            case '110kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/capacitor_110.png';
                                break;
                            case '220kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/capacitor_220.png';
                                break;
                            case '500kV':
                                data[i].icon = './css/zTreeStyle/Grid-model/capacitor_500.png';
                                break;
                            default :
                                data[i].icon = './css/zTreeStyle/Grid-model/capacitor_1000.png';
                                break;
                        }
                    } else if (data[i].tableName == "ps_grounddisconnector") {
                        //  接地刀闸
                        data[i].icon = './css/zTreeStyle/Grid-model/jddz.png';
                    } else{
                        data[i].icon = './css/zTreeStyle/Grid-model/ConverterStation1_1000.png';
                    }

                }
                newNode = treeObj.addNodes(node, data);
            }
        },
        error: function (event, XMLHttpRequest, ajaxOptions, thrownError) {
            result = true;
        }
    })
};