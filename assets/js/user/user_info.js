$(function () {
    let form = layui.form;
    let layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称应该输入 1~6 位之间!'
            }
        }
    })
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('res.message');
                }
                form.val('formUserInfo', res.data);
            }
        })
    }
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败！');
                } else {
                    layer.msg('信息修改成功！');
                    window.parent.getUserInfo();
                }
            }
        })
    })

})