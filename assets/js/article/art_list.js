$(function () {

    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        status: ''
    }
    template.defaults.imports.dateFormat = function (daStr) {
        var dt = new Date(daStr);
        var y = padZer(dt.getFullYear());
        var m = padZer(dt.getMonth() + 1);
        var d = padZer(dt.getDate());
        var hh = padZer(dt.getHours());
        var mm = padZer(dt.getMinutes());
        var ss = padZer(dt.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }
    function padZer(n) {
        return n < 10 ? "0" + n : n;
    }

    initTable()
    initCate()
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
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
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        initTable();
    })
    //定义渲染分页的方法
    function renderPage(total) {
        //调用 laypage.render方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的 ID
            count: total, //总条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],
            jump: function (obj, first) {
                q.pagesize = obj.limit;
                q.pagenum = obj.curr;
                if (!first) {
                    initTable()
                }
            }
        })
    }
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        let len = $('.btn-delete').length;
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除文章成功！');
                    // if (len === 1 && q.pagenum > 1 && q.pagenum--);
                    $('.btn-delete').length === 1 && q.pagenum > 1 && q.pagenum--;
                    initTable();
                }
            })

            layer.close(index);
        });
    });
})