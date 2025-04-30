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
    let currentLanguage = localStorage.getItem('preferredLanguage') || window.defaultLanguage || 'en';

    function getTranslatedString(key) {
        if (window.siteLanguages && window.siteLanguages[currentLanguage] && window.siteLanguages[currentLanguage].sidebar && window.siteLanguages[currentLanguage].sidebar[key]) {
            return window.siteLanguages[currentLanguage].sidebar[key];
        }
        return ''; // Fallback
    }

    function updateToggleButtonTooltip() {
        if (!sidebarToggleButton.length || $(window).width() < 993) return;

        let tooltipKey;
        if (isPinned) {
            tooltipKey = 'tooltip_unpin';
        } else {
            if (bodyElement.hasClass('sidebar-collapsed')) {
                tooltipKey = 'tooltip_expand';
            } else {
                tooltipKey = 'tooltip_pin';
            }
        }
        const tooltipText = getTranslatedString(tooltipKey);

        sidebarToggleButton.attr('data-tooltip', tooltipText);
        // Re-initialize tooltip to update text
        sidebarToggleButton.tooltip('destroy');
        sidebarToggleButton.tooltip({delay: 50, position: 'right'});
    }


    function applySidebarState() {
      if (isPinned) {
        bodyElement.removeClass('sidebar-collapsed');
      } else {
        if ($(window).width() >= 993) {
             bodyElement.addClass('sidebar-collapsed');
        }
      }
       updateToggleButtonTooltip(); // Update tooltip whenever state might change
    }

    const savedPinnedState = localStorage.getItem('sidebarPinnedState');
    if (savedPinnedState === 'pinned') {
      isPinned = true;
    } else {
      isPinned = false;
    }

    if (isPinned && $(window).width() >= 993) {
        bodyElement.removeClass('sidebar-collapsed');
    } else if (!isPinned && $(window).width() >= 993) {
         bodyElement.addClass('sidebar-collapsed');
    }
    
    $('.tooltipped').tooltip({delay: 50}); // Initialize all tooltips on page load
    updateToggleButtonTooltip(); // Set initial tooltip for the button


    if (sidebarToggleButton.length) {
      sidebarToggleButton.on('click', function(e) {
        e.preventDefault();
         if ($(window).width() >= 993) {
            isPinned = !isPinned;
            localStorage.setItem('sidebarPinnedState', isPinned ? 'pinned' : 'unpinned');
            applySidebarState(); // This now also calls updateToggleButtonTooltip
            sidebarElement.trigger('mouseleave');
         } else {
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
                updateToggleButtonTooltip(); // Update tooltip when hovered open
            }
        });

        sidebarElement.on('mouseleave', function() {
            setTimeout(function() {
                if (!isPinned && !sidebarElement.is(':hover')) {
                    bodyElement.addClass('sidebar-collapsed');
                    updateToggleButtonTooltip(); // Update tooltip when collapsed after hover
                }
            }, 100);
        });
    }


    const languageToggleButton = $('#language-toggle-button');

    function updatePageText(lang) {
      if (!window.siteLanguages) {
          console.error("window.siteLanguages is not defined.");
          return;
      }
      if (!window.siteLanguages[lang]) {
        console.error(`Language data object not found for: ${lang}`);
        return;
      }
      currentLanguage = lang; // Update global language state
      const translations = window.siteLanguages[lang];

      document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        let text = null;
        const knownTopLevelKeys = ['sidebar', 'page_titles', 'header', 'filter', 'projects_page', 'index_page'];
        let sectionKey = null;
        let subKey = null;

        for (const topKey of knownTopLevelKeys) {
            if (key.startsWith(topKey + '_')) {
                sectionKey = topKey;
                subKey = key.substring(topKey.length + 1);
                if (translations[sectionKey] && typeof translations[sectionKey] === 'object' && subKey in translations[sectionKey]) {
                    text = translations[sectionKey][subKey];
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
            } else if (element.dataset.tooltip && key.endsWith('_tooltip') && element.id !== 'sidebar-toggle-button') { // Exclude toggle button tooltip here
               element.dataset.tooltip = text;
               // Re-init tooltip if needed for other elements
               // $(element).tooltip('destroy');
               // $(element).tooltip({delay: 50});
            } else if (element.children.length > 0 && element.id !== 'sidebar-toggle-button') { // Exclude button text span if it existed
               let updated = false;
               for (let i = 0; i < element.childNodes.length; i++) {
                  if (element.childNodes[i].nodeType === Node.TEXT_NODE && element.childNodes[i].nodeValue.trim() !== '') {
                    element.childNodes[i].nodeValue = text;
                    updated = true;
                    break;
                  }
               }
            } else if (element.id !== 'sidebar-toggle-button') { // Exclude button text span if it existed
              element.textContent = text;
            }
          } else if (text !== null) {
              console.warn(`Value found for key "${key}" is not a string:`, text);
          }
      });
       updateToggleButtonTooltip(); // Update toggle button tooltip after language change
    }

    if (window.siteLanguages) {
        updatePageText(currentLanguage);
    } else {
        console.warn("window.siteLanguages not defined on initial load.");
    }

    if (languageToggleButton.length) {
      languageToggleButton.on('click', function(e){
        e.preventDefault();
        let nextLanguage = (currentLanguage === 'en') ? 'zh' : 'en';
        localStorage.setItem('preferredLanguage', nextLanguage);
        updatePageText(nextLanguage); // Pass the new language to the update function
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