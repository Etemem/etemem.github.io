(function($){
  $(function(){

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
    const sidebarElement = $('#slide-out');
    const bodyElement = $('body');
    let isPinned = false;

    function applySidebarState() {
      if (isPinned) {
        bodyElement.removeClass('sidebar-collapsed');
      } else {
        if ($(window).width() >= 993) { // Only collapse if on desktop view
             bodyElement.addClass('sidebar-collapsed');
        }
      }
    }

    const savedPinnedState = localStorage.getItem('sidebarPinnedState');
    if (savedPinnedState === 'pinned') {
      isPinned = true;
    } else {
      isPinned = false;
    }
    
    // Apply initial state based on pinned status OR original logic for non-pinned
    if (isPinned && $(window).width() >= 993) {
        bodyElement.removeClass('sidebar-collapsed'); 
    } else if (!isPinned && $(window).width() >= 993) {
         bodyElement.addClass('sidebar-collapsed');
    }
    // Note: Removed the direct reliance on 'sidebarState' for initial load if pinned logic exists.


    if (sidebarToggleButton.length) {
      sidebarToggleButton.on('click', function(e) {
        e.preventDefault();
         if ($(window).width() >= 993) { // Only allow pinning/unpinning on desktop
            isPinned = !isPinned;
            localStorage.setItem('sidebarPinnedState', isPinned ? 'pinned' : 'unpinned');
            
            if (isPinned) {
                 bodyElement.removeClass('sidebar-collapsed');
            } else {
                 bodyElement.addClass('sidebar-collapsed');
                 // Simulate mouseleave might be needed if mouse is over sidebar when unpinning
                 sidebarElement.trigger('mouseleave'); 
            }
         } else {
             // On mobile, the button should probably just open/close the sidenav
             // This part depends on how Materialize Sidenav handles it, might not need extra code
             // Or find the instance and call .open()/.close() if needed
             const instance = M.Sidenav.getInstance(sidebarElement[0]);
             if (instance) {
                 if (instance.isOpen) {
                     instance.close();
                 } else {
                     instance.open();
                 }
             }
         }
      });
    }


    if (sidebarElement.length && $(window).width() >= 993) {
        sidebarElement.on('mouseenter', function() {
            if (!isPinned) {
                bodyElement.removeClass('sidebar-collapsed');
            }
        });

        sidebarElement.on('mouseleave', function() {
            setTimeout(function() {
                if (!isPinned && !sidebarElement.is(':hover')) {
                    bodyElement.addClass('sidebar-collapsed');
                }
            }, 100);
        });
    }


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
        const knownTopLevelKeys = ['sidebar', 'page_titles', 'header', 'filter', 'projects_page', 'index_page'];
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
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder') && key === 'header_search_placeholder') {
              element.placeholder = text;
            } else if (key === 'projects_page_show_forked' && element.tagName === 'LABEL') {
               for (let i = 0; i < element.childNodes.length; i++) {
                 if (element.childNodes[i].nodeType === Node.TEXT_NODE) {
                   element.childNodes[i].nodeValue = text;
                   break;
                 }
               }
            } else if (element.dataset.tooltip && key.endsWith('_tooltip')) {
               element.dataset.tooltip = text;
            } else if (element.children.length > 0) {
               let updated = false;
               for (let i = 0; i < element.childNodes.length; i++) {
                  if (element.childNodes[i].nodeType === Node.TEXT_NODE && element.childNodes[i].nodeValue.trim() !== '') {
                    element.childNodes[i].nodeValue = text;
                    updated = true;
                    break;
                  }
               }
            } else {
              element.textContent = text;
            }
          } else if (text !== null) {
              console.warn(`Value found for key "${key}" is not a string:`, text);
          }
      });
    }

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

    const darkModeToggle = $('#dark-mode-toggle');
    const body = $('body');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    function applyTheme(theme) {
      if (theme === 'dark') {
        body.addClass('dark-mode');
      } else {
        body.removeClass('dark-mode');
      }
    }

    function getCurrentTheme() {
      let preferredTheme = localStorage.getItem('theme');
      if (preferredTheme) {
        return preferredTheme;
      } else {
         return prefersDarkScheme.matches ? 'dark' : 'light';
      }
    }

    let currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    if (darkModeToggle.length) {
      darkModeToggle.on('click', function(e) {
        e.preventDefault();
        currentTheme = body.hasClass('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
      });
    }

     try {
       prefersDarkScheme.addEventListener('change', (e) => {
           if (!localStorage.getItem('theme')) {
               applyTheme(e.matches ? 'dark' : 'light');
           }
       });
     } catch (e1) {
        try {
            prefersDarkScheme.addListener((e) => {
                if (!localStorage.getItem('theme')) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        } catch (e2) {
            console.error("Browser doesn't support media query listeners for prefers-color-scheme.");
        }
     }

  });
})(jQuery);