$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initCate()
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 初始化富文本编辑器
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);


    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    let state = '已发布'
    $('#btnSave').on('click', function () {
        state = '草稿'
    })
    $('#form-add').on('submit', function (e) {
        e.preventDefault();
        let fd = new FormData(this);
        fd.append('state', state);
        //base64是字符串
        //生成二进制图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                //ajax一定要放到回调函数里面
                //因为生成文件是耗时操作，异步，所以必须保证发送ajax的时候图片已经生成，所以必须写到回到函数中
                // console.log(2);
                publishArticle(fd);
            })
    })
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('发布文章成功！');
                // location.href = '/article/art_list.html'
                // window.parent.document.getElementById('wenzhangliebiao').click();

                // console.log(window.parent.document);
                // console.log(window.parent.$('[id=wenzhangliebiao]'))
                window.parent.$('[id=wenzhangliebiao]')[0].click();
                // window.parent.document.$('[id=wenzhangliebiao]').click();
            }
        })
    }
})