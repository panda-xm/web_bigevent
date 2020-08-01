$(function () {
    getUserInfo();
    let layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('是否确认退出', { icon: 3, title: '提示' }, function (index) {
            //do something
            //隐藏弹出框
            layer.close(index);
            location.href = '/login.html';
            localStorage.removeItem('token');
        });
    })
})
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        //jquery中的ajax,专门用于设置请求信息的属性
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            //调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        }
    })
}
function renderAvatar(user) {
    let uname = user.nickname || user.username;
    $('.welcome').show().html("&nbsp;&nbsp;" + uname);
    if (user.user_pic !== null) {
        $('.youhua').hide();
        $('.layui-nav-img').attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        $('.youhua').show();
        $('.layui-nav-img').hide();
        $('.text-avatar').show().html(uname[0]);
    }
}