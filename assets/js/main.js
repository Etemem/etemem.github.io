(function($){
  $(function(){

    // --- 初始化移动端侧边栏 ---
    // (保持你现有的初始化方式)
    try {
      // 尝试旧版 Materialize 初始化
      if (typeof $.fn.sideNav === 'function') {
        $('.button-collapse').sideNav();
        console.log("Initialized sideNav with $.fn.sideNav()");
      } else if (typeof M !== 'undefined' && M.Sidenav) {
        // 尝试新版 Materialize 初始化
        var sideNavElems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(sideNavElems);
        console.log("Initialized sideNav with M.Sidenav.init");
      } else {
        console.error("Materialize sideNav function not found.");
      }
    } catch (e) {
      console.error("Error initializing sideNav:", e);
      // 可以添加备用初始化逻辑或放弃
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
    // --- 修改：语言切换逻辑 ---
    // ===========================================
    const languageToggleButton = $('#language-toggle-button');
    // 从 localStorage 获取语言，若无则使用 _config.yml 中定义的默认值
    // 确保 window.defaultLanguage 在 _includes/header.html 中通过 <script> 定义了
    let currentLanguage = localStorage.getItem('preferredLanguage') || window.defaultLanguage || 'en';

    // *** 新的通用文本更新函数 ***
    function updatePageText(lang) {
      // 检查 window.siteLanguages 是否已定义（应在 _includes/header.html 中通过 <script> 定义）
      if (!window.siteLanguages) {
          console.error("window.siteLanguages is not defined. Check _config.yml and header include.");
          return;
      }
      // 检查对应语言的数据是否存在
      if (!window.siteLanguages[lang]) {
        console.error("Language data not found for:", lang);
        return;
      }
      const translations = window.siteLanguages[lang];

      // 遍历所有带 data-key 的元素
      document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key; // 获取 data-key 的值
        const keyParts = key.split('_'); // 按下划线分割 key，例如 "sidebar_home" -> ["sidebar", "home"]
        let text = translations; // 从顶层翻译对象开始查找

        // 逐级在 translations 对象中查找对应的文本
        try {
          for (const part of keyParts) {
            if (text && typeof text === 'object' && part in text) {
              text = text[part]; // 进入下一级
            } else {
              text = null; // 中途未找到，标记为 null
              break;
            }
          }

          // 如果最终找到了文本 (text 不是 null 或 undefined)
          if (text !== null && typeof text !== 'undefined') {
            // 根据元素类型或特定 key 更新内容
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder') && key === 'header_search_placeholder') {
              element.placeholder = text; // 更新搜索框 placeholder
            } else if (element.id === 'js-rotating' && key === 'about_page_intro_rotating') {
              // 特殊处理 Morphext 旋转文本
              try {
                 const $morphext = $(element);
                 // 检查 Morphext 插件是否已初始化
                 if ($.fn.Morphext && $morphext.data('plugin_Morphext')) {
                     $morphext.data('plugin_Morphext').stop(); // 停止动画
                 }
                 element.textContent = text; // 更新原始文本

                 // 从 data 属性读取配置或使用默认值重新初始化
                 $morphext.Morphext({
                    animation: $morphext.data('animation') || "flip",
                    separator: $morphext.data('separator') || ",",
                    speed: parseInt($morphext.data('speed'), 10) || 2000,
                 });
              } catch(e) {
                  console.error("Error re-initializing Morphext for key:", key, e);
                  element.textContent = text; // 备用方案：直接更新文本
              }
            } else if (element.dataset.tooltip) {
              // 尝试更新 Materialize tooltip 内容 (如果 key 对应 tooltip)
              // 注意：这需要 Materialize 的 Tooltip JS 已初始化
              // 并且 key 需要明确指向 tooltip 的内容, 例如 data-key="projects_page_stars_tooltip"
              // _config.yml 中也需要定义 tooltip 的键值
              try {
                // 假设 key 'projects_page_stars_tooltip' 对应 'stars' tooltip
                 element.dataset.tooltip = text; // 直接更新 data-tooltip 属性
                 // 如果 Materialize Tooltip 实例已存在，可能需要销毁并重新初始化才能看到更新
                 // var instance = M.Tooltip.getInstance(element);
                 // if (instance) {
                 //   instance.destroy();
                 //   M.Tooltip.init(element);
                 // }
              } catch(e) {
                  console.warn("Could not update tooltip for key:", key, e);
                  element.textContent = text; // 备用：更新元素自身文本
              }
            } else {
              // 对大多数其他元素，直接更新 textContent
              element.textContent = text;
            }
          } else {
             // console.warn("Translation not found for key:", key); // 可选：打开此行以调试未找到的翻译
          }
        } catch (e) {
           console.error("Error processing translation for key:", key, e);
        }
      });
    }

    // 页面加载时立即更新一次文本
    // 确保此时 window.siteLanguages 已经可用
    if (window.siteLanguages) {
        updatePageText(currentLanguage);
    } else {
        // 如果 _config.yml 数据还没加载好，可以稍微延迟执行
        // 但更好的方法是确保 header.html 中的 <script> 在这个脚本之前执行
        console.warn("window.siteLanguages not ready on initial load, might need adjustments in script order.");
        // setTimeout(() => updatePageText(currentLanguage), 100); // 延迟执行作为备选
    }


    // 语言切换按钮点击事件
    if (languageToggleButton.length) {
      languageToggleButton.on('click', function(e){
        e.preventDefault();
        // 切换语言
        currentLanguage = (currentLanguage === 'en') ? 'zh' : 'en';
        // 保存新语言到 localStorage
        localStorage.setItem('preferredLanguage', currentLanguage);
        // 更新页面文本 (调用新的通用函数)
        updatePageText(currentLanguage);

        // 如果 Morphext 在 about 页面，确保它被正确更新和重启
        if (document.getElementById('js-rotating')) {
            // updatePageText 内部已经包含了重启逻辑
        }
      });
    }
    // --- 结束修改：语言切换逻辑 ---

  }); // end of document ready
})(jQuery); // end of jQuery name space