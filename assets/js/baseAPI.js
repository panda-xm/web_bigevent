//设置路径（测试）
let baseURL = 'http://ajax.frontend.itheima.net';
//设置路径（生产）
// let baseURL = 'http://www.itcast.cn';

//拦截/过滤 每一次ajax请求，配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.complete = function (res) {
        let data = res.responseJSON;
        if (data.status == 1 && data.message == '身份认证失败！') {
            location.href = '/login.html';
            localStorage.removeItem('token');
        }
    }
})
