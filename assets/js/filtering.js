$(document).ready(function() {
  // 选择页面上所有类为 filter-button 的按钮
  $('.filter-controls .filter-button').on('click', function() {
    const $this = $(this);
    const filterValue = $this.data('filter');
    const $allSections = $('.category-section, .tag-section'); // 获取所有文章区域
    const $allDividers = $('hr.section-divider'); 
    const $filterButtons = $('.filter-controls .filter-button'); // 获取所有筛选按钮

    if (filterValue === 'all') {
      // 如果点击的是 "显示全部"
      $filterButtons.removeClass('active');
      $this.addClass('active'); // 激活 "显示全部" 按钮
    } else {
      // 如果点击的是具体分类/标签按钮
      $('.filter-controls .filter-button[data-filter="all"]').removeClass('active'); // 取消 "显示全部" 的激活状态
      $this.toggleClass('active'); // 切换当前按钮的激活状态

      if ($('.filter-controls .filter-button.active').length === 0) {
        $('.filter-controls .filter-button[data-filter="all"]').addClass('active');
      }
    }

    let activeFilters = [];
    $('.filter-controls .filter-button.active').each(function() {
      activeFilters.push($(this).data('filter'));
    });

    if (activeFilters.includes('all') || activeFilters.length === 0) {
      // 如果是显示全部，则显示所有 sections 和 dividers
      $allSections.show();
      $allDividers.show();
    } else {
      // 否则，先隐藏所有 sections 和 dividers
      $allSections.hide();
      $allDividers.hide();

      // 然后遍历所有 sections
      $allSections.each(function() {
        const $section = $(this);
        const sectionIdentifier = $section.data('category') || $section.data('tag'); // 获取 section 的标识

        // 检查当前 section 是否在激活的筛选器中
        if (sectionIdentifier && activeFilters.includes(sectionIdentifier)) {
          // 如果是，则显示这个 section
          $section.show();
          $section.prev('hr.section-divider').show();
        }
      });
    }
  });
});