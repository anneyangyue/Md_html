$(function () {
  $.ajax({
    url: 'http://localhost:3001/testMd',
    // url: 'http://localhost:3001/test',
    success: function (data) {
      console.log('ssss')
      console.log(data)
      var converter = new showdown.Converter() // 初始化转换器
      var htmlcontent = converter.makeHtml(data) // 将MarkDown转为html格式的内容
      $("#test").html(htmlcontent) // 添加到 div 中 显示出来
    },
    error: function (err) {
      console.log('err', err.responseText)
    }
  })
})