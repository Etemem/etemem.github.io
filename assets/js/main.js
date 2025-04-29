(function($){
  $(function(){

    // --- Initialization logic (SideNav, Sidebar Toggle) ---
    // (Keep your existing initialization code here as before)
    try {
      if (typeof $.fn.sideNav === 'function') {
        $('.button-collapse').sideNav();
        console.log("Initialized sideNav with $.fn.sideNav()");
      } else if (typeof M !== 'undefined' && M.Sidenav) {
        var sideNavElems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(sideNavElems);
        console.log("Initialized sideNav with M.Sidenav.init");
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

    // *** Helper function to safely get nested properties ***
    function getPropertyByPath(obj, path) {
        const parts = path.split('_');
        let current = obj;
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return null; // Path doesn't exist
            }
        }
        // Only return if it's a string (or maybe number), not an object/array
        return (typeof current === 'string' || typeof current === 'number') ? current : null;
    }


    // *** Revised通用文本更新函数 ***
    function updatePageText(lang) {
      console.log(`Attempting to update text for language: ${lang}`); // Log language attempt

      if (!window.siteLanguages) {
          console.error("window.siteLanguages is not defined.");
          return;
      }
      if (!window.siteLanguages[lang]) {
        console.error(`Language data object not found for: ${lang}`);
        return;
      }
      const translations = window.siteLanguages[lang];
      console.log("Translations object loaded:", translations); // Log loaded translations

      document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        console.log(`Processing element: ${element.tagName}#${element.id || ''}.${element.className || ''} with data-key: ${key}`); // Log element being processed

        let text = null;
        try {
           text = getPropertyByPath(translations, key); // Use helper function

          if (text !== null) {
            console.log(`  FOUND text: "${text}" for key: ${key}`); // Log found text

            // --- Element Update Logic ---
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder') && key === 'header_search_placeholder') {
              console.log(`  Updating placeholder for input#${element.id}`);
              element.placeholder = text;
            } else if (element.id === 'js-rotating' && key === 'about_page_intro_rotating') {
               console.log(`  Updating Morphext element#${element.id}`);
              try {
                 const $morphext = $(element);
                 if ($.fn.Morphext && $morphext.data('plugin_Morphext')) {
                     console.log("    Stopping existing Morphext instance...");
                     $morphext.data('plugin_Morphext').stop();
                 }
                 element.textContent = text; // Update text *before* re-init
                 console.log("    Re-initializing Morphext...");
                 $morphext.Morphext({
                    animation: $morphext.data('animation') || "flip",
                    separator: $morphext.data('separator') || ",",
                    speed: parseInt($morphext.data('speed'), 10) || 2000,
                 });
                 console.log("    Morphext re-initialized.");
              } catch(e) {
                  console.error("    Error re-initializing Morphext:", e);
                  element.textContent = text; // Fallback
              }
            } else if (element.dataset.tooltip && key.endsWith('_tooltip')) { // Basic check if key might be for a tooltip
               console.log(`  Attempting to update tooltip for ${element.tagName} with key ${key}`);
               element.dataset.tooltip = text;
               // Add tooltip re-initialization logic if needed here
            } else {
              console.log(`  Updating textContent for ${element.tagName}`);
              element.textContent = text; // Default update
            }
            console.log(`  Update attempt finished for key: ${key}`); // Log after attempt

          } else {
             console.warn(`  Translation NOT found for key: ${key}`); // Highlight not found
          }
        } catch (e) {
           console.error(`  Error processing translation for key: ${key}`, e);
        }
      });
       console.log("Finished processing all data-key elements."); // Log end of processing
    }

    // --- Initial Load & Event Listener ---
    if (window.siteLanguages) {
        updatePageText(currentLanguage);
    } else {
        console.warn("window.siteLanguages not defined on initial load. Translations might be delayed or fail.");
        // Optional: Add a small delay or listen for a custom event if needed
        // setTimeout(() => {
        //   if(window.siteLanguages) updatePageText(currentLanguage);
        // }, 200);
    }

    if (languageToggleButton.length) {
      languageToggleButton.on('click', function(e){
        e.preventDefault();
        currentLanguage = (currentLanguage === 'en') ? 'zh' : 'en';
        localStorage.setItem('preferredLanguage', currentLanguage);
        updatePageText(currentLanguage); // Call the revised update function
      });
    }

  }); // end of document ready
})(jQuery); // end of jQuery name space