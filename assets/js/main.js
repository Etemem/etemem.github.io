(function($){
  $(function(){

    // 初始化移动端侧边栏 (保持不变)
    $('.button-collapse').sideNav();

    // --- 新增桌面侧边栏切换逻辑 ---
    const desktopToggleButton = $('#desktop-sidebar-toggle'); // 获取桌面切换按钮
    const bodyElement = $('body'); // 获取 body 元素

    if (desktopToggleButton.length) { // 确保按钮存在
      desktopToggleButton.on('click', function(e) {
        e.preventDefault(); // 阻止链接默认行为
        bodyElement.toggleClass('sidebar-collapsed'); // 切换 body 上的类

        // 可选：根据状态存储偏好到 localStorage
        // if (bodyElement.hasClass('sidebar-collapsed')) {
        //   localStorage.setItem('sidebarState', 'collapsed');
        // } else {
        //   localStorage.setItem('sidebarState', 'expanded');
        // }
      });
    }

    // 可选：页面加载时恢复上次状态
    // const savedSidebarState = localStorage.getItem('sidebarState');
    // if (savedSidebarState === 'collapsed' && $(window).width() >= 993) {
    //   bodyElement.addClass('sidebar-collapsed');
    // }
    // --- 结束新增 ---

  }); // end of document ready
})(jQuery); // end of jQuery name space