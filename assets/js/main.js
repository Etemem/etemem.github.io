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
    // --- Revised Language Switching Logic ---
    // ===========================================
    const languageToggleButton = $('#language-toggle-button');
    let currentLanguage = localStorage.getItem('preferredLanguage') || window.defaultLanguage || 'en';

    function updatePageText(lang) {
      // console.log(`Attempting to update text for language: ${lang}`);

      if (!window.siteLanguages) {
          console.error("window.siteLanguages is not defined.");
          return;
      }
      if (!window.siteLanguages[lang]) {
        console.error(`Language data object not found for: ${lang}`);
        return;
      }
      const translations = window.siteLanguages[lang];
      // console.log("Translations object loaded:", translations);

      document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        // console.log(`Processing element: ${element.tagName}#${element.id || ''}.${element.className || ''} with data-key: ${key}`);

        let text = null;
        const knownTopLevelKeys = ['sidebar', 'page_titles', 'header', 'filter', 'projects_page', 'index_page', 'about_page'];
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
            // console.log(`  FOUND text: "${text}" for key: ${key}`);

            // --- *** 修改：更精细的元素更新逻辑 *** ---
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder') && key === 'header_search_placeholder') {
              // 更新 Placeholder (保持不变)
              element.placeholder = text;
            } else if (element.id === 'js-rotating' && key === 'about_page_intro_rotating') {
              // 更新 Morphext (逻辑不变，依赖其健壮性)
              try {
                 const $morphext = $(element);
                 if ($.fn.Morphext && $morphext.data('plugin_Morphext')) {
                     $morphext.data('plugin_Morphext').stop();
                 }
                 element.textContent = text; // Morphext 需要 textContent 更新
                 $morphext.Morphext({
                    animation: $morphext.data('animation') || "flip",
                    separator: $morphext.data('separator') || ",",
                    speed: parseInt($morphext.data('speed'), 10) || 2000,
                 });
              } catch(e) {
                  console.error("Error re-initializing Morphext:", e);
                  element.textContent = text;
              }
            } else if (key === 'projects_page_show_forked' && element.tagName === 'LABEL') {
               // 特殊处理项目页的开关标签：只更新第一个文本节点
               for (let i = 0; i < element.childNodes.length; i++) {
                 if (element.childNodes[i].nodeType === Node.TEXT_NODE) { // 找到第一个文本节点
                   element.childNodes[i].nodeValue = text; // 更新文本节点的值
                   break; // 只更新第一个找到的
                 }
               }
            } else if (element.dataset.tooltip && key.endsWith('_tooltip')) {
               // 更新 Tooltip (保持不变)
               element.dataset.tooltip = text;
            } else if (element.children.length > 0) {
              // *** 如果元素有子元素，但不是上面特殊处理的类型 ***
              // *** 尝试只更新其第一个子文本节点 (适用于 "Statistics<span><i>" 这种情况) ***
              let updated = false;
              for (let i = 0; i < element.childNodes.length; i++) {
                 if (element.childNodes[i].nodeType === Node.TEXT_NODE && element.childNodes[i].nodeValue.trim() !== '') {
                   element.childNodes[i].nodeValue = text;
                   updated = true;
                   break;
                 }
              }
              if (!updated) {
                // 如果找不到文本节点或没有文本节点（例如内部全是其他标签），则谨慎起见不修改或只修改textContent
                console.warn(`Element with key ${key} has children but no direct text node found for update. Check structure or update logic.`);
                // element.textContent = text; // 避免使用这个，因为它会破坏子元素
              }

            } else {
              // *** 对于确定只包含文本的元素 (如侧边栏的 span, 按钮文本等) ***
              element.textContent = text; // 使用 textContent
            }
          } else if (text !== null) {
              console.warn(`Value found for key "${key}" is not a string:`, text);
          }
          // else { // 移除这里的 console.warn, 避免干扰
             // console.warn(`Translation NOT found for key: ${key}`);
          // }
      });
       // console.log("Finished processing all data-key elements.");
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