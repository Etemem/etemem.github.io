(function($){
  $(function(){

    // --- Initialization logic (SideNav, Sidebar Toggle) ---
    try {
      if (typeof $.fn.sideNav === 'function') {
        $('.button-collapse').sideNav();
      } else if (typeof M !== 'undefined' && M.Sidenav) {
        var sideNavElems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(sideNavElems);
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
    // --- Language Switching Logic ---
    // ===========================================
    const languageToggleButton = $('#language-toggle-button');
    let currentLanguage = localStorage.getItem('preferredLanguage') || window.defaultLanguage || 'en';

    function updatePageText(lang) {
      if (!window.siteLanguages) {
          console.error("window.siteLanguages is not defined.");
          return;
      }
      if (!window.siteLanguages[lang]) {
        console.error(`Language data object not found for: ${lang}`);
        return;
      }
      const translations = window.siteLanguages[lang];

      document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        let text = null;
        const knownTopLevelKeys = ['sidebar', 'page_titles', 'header', 'filter', 'projects_page', 'index_page']; // 移除 'about_page'
        let found = false;

        for (const topKey of knownTopLevelKeys) {
            if (key.startsWith(topKey + '_')) {
                const subKey = key.substring(topKey.length + 1);
                if (translations[topKey] && typeof translations[topKey] === 'object' && subKey in translations[topKey]) {
                    text = translations[topKey][subKey];
                    found = true;
                    break;
                }
            }
        }

        if (text !== null && typeof text === 'string') {
            // *** 更新逻辑 ***
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder') && key === 'header_search_placeholder') {
              element.placeholder = text;
            // *** 移除 Morphext 的特殊处理分支 ***
            // } else if (element.id === 'js-rotating' && key === 'about_page_intro_rotating') {
            //    // ... (相关代码已删除) ...
            } else if (key === 'projects_page_show_forked' && element.tagName === 'LABEL') {
               // 处理项目页开关标签文本 (保持不变)
               for (let i = 0; i < element.childNodes.length; i++) {
                 if (element.childNodes[i].nodeType === Node.TEXT_NODE) {
                   element.childNodes[i].nodeValue = text;
                   break;
                 }
               }
            } else if (element.dataset.tooltip && key.endsWith('_tooltip')) {
               element.dataset.tooltip = text;
            } else if (element.children.length > 0) {
               // 尝试更新包含子元素的元素的第一个文本节点 (保持不变)
               let updated = false;
               for (let i = 0; i < element.childNodes.length; i++) {
                  if (element.childNodes[i].nodeType === Node.TEXT_NODE && element.childNodes[i].nodeValue.trim() !== '') {
                    element.childNodes[i].nodeValue = text;
                    updated = true;
                    break;
                  }
               }
               // if (!updated) { console.warn(...) } // 可选警告
            } else {
              // 默认更新 textContent (保持不变)
              element.textContent = text;
            }
          } else if (text !== null) {
              console.warn(`Value found for key "${key}" is not a string:`, text);
          }
          // else { // 之前移除的警告
             // console.warn(`Translation NOT found for key: ${key}`);
          // }
      });
    }

    // --- Initial Load & Event Listener ---
    if (window.siteLanguages) {
        updatePageText(currentLanguage);
    } else {
        console.warn("window.siteLanguages not defined on initial load.");
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