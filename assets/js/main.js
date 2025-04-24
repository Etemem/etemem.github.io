(function($){
  $(function(){
    // 添加新的点击事件处理
    $('#menu-toggle-button').on('click', function(e) {
      e.preventDefault(); // 阻止链接默认行为
      $('body').toggleClass('sidebar-open'); // 切换 body 的 class
    });
  });
})(jQuery);