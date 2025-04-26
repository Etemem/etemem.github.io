(function($){
  $(function(){

    // 初始化移动端侧边栏
    // 注意：如果您使用的是较新版本的 Materialize， .sideNav() 可能已被弃用，
    // 可能需要使用 M.Sidenav.init($('.sidenav')) 或类似方法。
    // 但基于原始代码，我们暂时保留 .sideNav()。
    // 如果移动端侧边栏无法打开，请检查 Materialize 文档进行更新。
    try {
      $('.button-collapse').sideNav();
    } catch (e) {
      console.error("Error initializing sideNav (maybe using newer Materialize?):", e);
      // 尝试新版初始化 (如果存在 .sidenav 类)
      var sideNavElems = document.querySelectorAll('.sidenav');
      if (typeof M !== 'undefined' && sideNavElems.length > 0) {
         M.Sidenav.init(sideNavElems);
         console.log("Initialized with M.Sidenav.init");
      }
    }


    // --- 修改部分：桌面端侧边栏切换 ---
    const sidebarToggleButton = $('#sidebar-toggle-button'); // <<< 修改选择器
    const bodyElement = $('body'); // 获取 body 元素

    if (sidebarToggleButton.length) { // 确保按钮存在
      sidebarToggleButton.on('click', function(e) { // <<< 修改变量名
        e.preventDefault(); // 阻止链接默认行为
        bodyElement.toggleClass('sidebar-collapsed'); // 切换 body 上的类

        // 根据状态存储偏好到 localStorage (保持注释状态，或根据需要取消注释)
        // if (bodyElement.hasClass('sidebar-collapsed')) {
        //   localStorage.setItem('sidebarState', 'collapsed');
        // } else {
        //   localStorage.setItem('sidebarState', 'expanded');
        // }
      });
    }

    // 页面加载时恢复上次状态 (保持注释状态，或根据需要取消注释)
    // const savedSidebarState = localStorage.getItem('sidebarState');
    // if (savedSidebarState === 'collapsed' && $(window).width() >= 993) {
    //   bodyElement.addClass('sidebar-collapsed');
    // }
    // --- 结束修改部分 ---

  }); // end of document ready
})(jQuery); // end of jQuery name space