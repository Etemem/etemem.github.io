(function($){
  $(function(){

    // --- 初始化移动端侧边栏 (保持不变) ---
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

    // --- 桌面端侧边栏切换 (保持不变) ---
    const sidebarToggleButton = $('#sidebar-toggle-button');
    const bodyElement = $('body');
    if (sidebarToggleButton.length) {
      sidebarToggleButton.on('click', function(e) {
        e.preventDefault();
        bodyElement.toggleClass('sidebar-collapsed');
        // 存储状态
        if (bodyElement.hasClass('sidebar-collapsed')) {
          localStorage.setItem('sidebarState', 'collapsed');
        } else {
          localStorage.setItem('sidebarState', 'expanded');
        }
      });
    }
    // 恢复状态
    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState === 'collapsed' && $(window).width() >= 993) {
       bodyElement.addClass('sidebar-collapsed');
    }

    // ===========================================
    // --- 新增：语言切换逻辑 ---
    // ===========================================
    const languageToggleButton = $('#language-toggle-button');
    const navTextSpans = $('#slide-out .nav-text'); // 获取所有侧边栏文本 span
    const langToggleTextSpan = $('#language-toggle-button .nav-text'); // 切换按钮的文本 span
    const langToggleIcon = $('#language-toggle-button i.material-icons'); // 切换按钮的图标

    // 从 localStorage 获取语言，若无则使用默认值
    let currentLanguage = localStorage.getItem('preferredLanguage') || window.defaultLanguage || 'en';

    // 更新侧边栏文本的函数
    function updateSidebarText(lang) {
      if (!window.siteLanguages || !window.siteLanguages[lang]) {
        console.error("Language data not found for:", lang);
        return; // 如果语言数据不存在，则不执行更新
      }
      const translations = window.siteLanguages[lang].sidebar;

      // 更新导航项文本
      navTextSpans.each(function() {
        const key = $(this).data('key');
        if (key && translations[key]) {
          $(this).text(translations[key]);
        }
      });

      // 更新语言切换按钮本身的文本和图标 (如果图标也需要切换的话)
      if (translations.language_toggle) {
          langToggleTextSpan.text(translations.language_toggle);
      }
       if (translations.language_icon) {
         // 如果图标名称不同，可以在这里更新图标 innerText
         // langToggleIcon.text(translations.language_icon);
       }
    }

    // 页面加载时立即更新一次文本
    updateSidebarText(currentLanguage);

    // 语言切换按钮点击事件
    if (languageToggleButton.length) {
      languageToggleButton.on('click', function(e){
        e.preventDefault();
        // 切换语言
        currentLanguage = (currentLanguage === 'en') ? 'zh' : 'en';
        // 保存新语言到 localStorage
        localStorage.setItem('preferredLanguage', currentLanguage);
        // 更新页面文本
        updateSidebarText(currentLanguage);
      });
    }
    // --- 结束新增：语言切换逻辑 ---

  }); // end of document ready
})(jQuery); // end of jQuery name space