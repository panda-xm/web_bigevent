$(function () {
    let layer = layui.layer;
    let form = layui.form;
    initArtCatelist();
    //获取文章分类的列表
    let indexAdd = null;
    let indexEdit = null;

    function initArtCatelist() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCatelist();
                layer.msg('分类添加成功');
                layer.close(indexAdd);
            }
        })
    })

    $('tbody').on('click', '.btn-edit', function (e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        let id = $(this).attr('data-id');
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('更新分类数据成功');
                layer.close(indexEdit);
                initArtCatelist();
            }
        })
    })
    $('tbody').on('click', '.btn-delete', function (e) {
        let id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除分类数据成功');
                    initArtCatelist();

                }
            })
            layer.close(index);
        });
    })
})