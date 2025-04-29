(function($){
  $(function(){

    // --- Initialization logic (SideNav, Sidebar Toggle) ---
    // (Keep your existing initialization code here as before)
    try {
      if (typeof $.fn.sideNav === 'function') {
        $('.button-collapse').sideNav();
        // console.log("Initialized sideNav with $.fn.sideNav()"); // 可选保留或移除日志
      } else if (typeof M !== 'undefined' && M.Sidenav) {
        var sideNavElems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(sideNavElems);
        // console.log("Initialized sideNav with M.Sidenav.init"); // 可选保留或移除日志
      } else {
        console.error("Materialize sideNav function not found.");
      }
    } catch (e) {
      console.error("Error initializing sideNav:", e);
    }

    const sidebarToggleButton = $('#sidebar-toggle-button');
    const bodyElement = $('body');
    if (sidebarToggleButton.length) {
      sidebarToggleButton.on('click', function(e) {
        e.preventDefault();
        bodyElement.toggleClass('sidebar-collapsed');
        localStorage.setItem('sidebarState', bodyElement.hasClass('sidebar-collapsed') ? 'collapsed' : 'expanded');
      });
    }
    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState === 'collapsed' && $(window).width() >= 993) {
       bodyElement.addClass('sidebar-collapsed');
    }

    // ===========================================
    // --- Revised Language Switching Logic ---
    // ===========================================
    const languageToggleButton = $('#language-toggle-button');
    let currentLanguage = localStorage.getItem('preferredLanguage') || window.defaultLanguage || 'en';

    // *** 修改：更可靠的文本更新函数 ***
    function updatePageText(lang) {
      // console.log(`Attempting to update text for language: ${lang}`); // 可选调试日志

      if (!window.siteLanguages) {
          console.error("window.siteLanguages is not defined.");
          return;
      }
      if (!window.siteLanguages[lang]) {
        console.error(`Language data object not found for: ${lang}`);
        return;
      }
      const translations = window.siteLanguages[lang];
      // console.log("Translations object loaded:", translations); // 可选调试日志

      document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        // console.log(`Processing element: ... with data-key: ${key}`); // 可选调试日志

        let text = null;
        // *** 修改：新的查找逻辑 ***
        const knownTopLevelKeys = ['sidebar', 'page_titles', 'header', 'filter', 'projects_page', 'index_page', 'about_page'];
        let found = false;

        for (const topKey of knownTopLevelKeys) {
            if (key.startsWith(topKey + '_')) {
                const subKey = key.substring(topKey.length + 1); // 获取下划线之后的部分作为次级键
                if (translations[topKey] && typeof translations[topKey] === 'object' && subKey in translations[topKey]) {
                    text = translations[topKey][subKey];
                    found = true;
                    break; // 找到就跳出循环
                }
            }
        }

        // (可以保留之前的 getPropertyByPath 作为备用，或者移除)
        // if (!found) { // 如果上面的逻辑没找到，可以尝试旧的通用查找（但可能仍有问题）
        //    console.warn(`Key ${key} not found via top-level check, trying general lookup.`);
        //    // text = getPropertyByPath(translations, key); // 旧的查找方式
        // }


        // --- 更新元素 ---
        if (text !== null && typeof text === 'string') { // 确保找到的是字符串
            // console.log(`  FOUND text: "${text}" for key: ${key}`); // 可选调试日志

            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder') && key === 'header_search_placeholder') {
              element.placeholder = text;
            } else if (element.id === 'js-rotating' && key === 'about_page_intro_rotating') {
              try {
                 const $morphext = $(element);
                 if ($.fn.Morphext && $morphext.data('plugin_Morphext')) {
                     $morphext.data('plugin_Morphext').stop();
                 }
                 element.textContent = text;
                 $morphext.Morphext({
                    animation: $morphext.data('animation') || "flip",
                    separator: $morphext.data('separator') || ",",
                    speed: parseInt($morphext.data('speed'), 10) || 2000,
                 });
              } catch(e) {
                  console.error("Error re-initializing Morphext:", e);
                  element.textContent = text;
              }
            } else if (element.dataset.tooltip && key.endsWith('_tooltip')) {
               element.dataset.tooltip = text;
               // 需要时添加 Tooltip 重新初始化代码
            } else {
              element.textContent = text;
            }
          } else if (text !== null) {
              console.warn(`Value found for key "${key}" is not a string:`, text); // 如果找到的不是字符串则警告
          }
          else {
             // *** 这个警告现在应该能正确指示 _config.yml 中确实缺少的键 ***
             console.warn(`Translation NOT found for key: ${key}`);
          }
      });
       // console.log("Finished processing all data-key elements."); // 可选调试日志
    }

    // --- Initial Load & Event Listener ---
    if (window.siteLanguages) {
        updatePageText(currentLanguage);
    } else {
        console.warn("window.siteLanguages not defined on initial load. Translations might be delayed or fail.");
    }

    if (languageToggleButton.length) {
      languageToggleButton.on('click', function(e){
        e.preventDefault();
        currentLanguage = (currentLanguage === 'en') ? 'zh' : 'en';
        localStorage.setItem('preferredLanguage', currentLanguage);
        updatePageText(currentLanguage);
      });
    }

  }); // end of document ready
})(jQuery); // end of jQuery name space