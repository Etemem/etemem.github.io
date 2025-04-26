(function($){
  $(function(){

    // 初始化移动端侧边栏
    try {
      $('.button-collapse').sideNav();
    } catch (e) {
      console.error("Error initializing sideNav (maybe using newer Materialize?):", e);
      var sideNavElems = document.querySelectorAll('.sidenav');
      if (typeof M !== 'undefined' && sideNavElems.length > 0) {
         M.Sidenav.init(sideNavElems);
         console.log("Initialized with M.Sidenav.init");
      }
    }


    // --- 桌面端侧边栏切换 ---
    const sidebarToggleButton = $('#sidebar-toggle-button');
    const bodyElement = $('body');

    if (sidebarToggleButton.length) {
      sidebarToggleButton.on('click', function(e) {
        e.preventDefault();
        bodyElement.toggleClass('sidebar-collapsed');

        // *** 取消注释：存储状态 ***
        if (bodyElement.hasClass('sidebar-collapsed')) {
          localStorage.setItem('sidebarState', 'collapsed');
        } else {
          localStorage.setItem('sidebarState', 'expanded');
        }
      });
    }

    // *** 取消注释：页面加载时恢复上次状态 ***
    const savedSidebarState = localStorage.getItem('sidebarState');
    // 仅在桌面端（宽度 >= 993px）且保存的状态是 collapsed 时应用
    if (savedSidebarState === 'collapsed' && $(window).width() >= 993) {
       bodyElement.addClass('sidebar-collapsed');
    }
    // --- 结束取消注释部分 ---

  }); // end of document ready
})(jQuery); // end of jQuery name space