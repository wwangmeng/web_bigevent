$(function() {
    var layer = layui.layer
    var form = layui.form
    getArticle();


    function getArticle() {
        $.ajax({
            method: "get",
            url: "/my/cate/list ",
            success: function(res) {
                // console.log(res);
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr)
            }
        });
    }

    //为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/cate/add',
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('新增分类失败！')
                }
                getArticle()
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
            // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/cate/info?id=' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    // 1、点击要有一个弹窗 

    // 2、弹窗里面有form表单 

    // 3、表单中有当前修改分类的数据回显 


    // 4、修改 
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
            // console.log(11);
        $.ajax({
            method: "PUT",
            url: '/my/cate/info',
            // 获取当前的
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.msg('修改分类失败')
                }
                getArticle();
                layer.msg('修改分类成功')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexEdit)
            }
        });
    });

    // 通过代理的形式，为删除按钮绑定点击事件：
    $('tbody').on('click', '.btn-delete', function() {
        // console.log(111);
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'DELETE',
                url: '/my/cate/del?id='  +  id,
                success: function(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    getArticle();
                }
            })
        })
    })
})