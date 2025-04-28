$(document).ready(function() {
  // 选择页面上所有类为 filter-button 的按钮
  $('.filter-controls .filter-button').on('click', function() {
    const $this = $(this);
    const filterValue = $this.data('filter');
    const $allSections = $('.category-section, .tag-section'); // 获取所有文章区域
    const $filterButtons = $('.filter-controls .filter-button'); // 获取所有筛选按钮

    if (filterValue === 'all') {
      // 如果点击的是 "显示全部"
      $filterButtons.removeClass('active'); 
      $this.addClass('active'); // 激活 "显示全部" 按钮
    } else {
      // 如果点击的是具体分类/标签按钮
      $('.filter-controls .filter-button[data-filter="all"]').removeClass('active'); // 取消 "显示全部" 的激活状态
      $this.toggleClass('active'); // 切换当前按钮的激活状态

      // 检查是否还有其他按钮被选中，如果没有，则激活 "显示全部"
      if ($('.filter-controls .filter-button.active').length === 0) {
        $('.filter-controls .filter-button[data-filter="all"]').addClass('active');
      }
    }

    let activeFilters = [];
    $('.filter-controls .filter-button.active').each(function() {
      activeFilters.push($(this).data('filter'));
    });

    if (activeFilters.includes('all') || activeFilters.length === 0) {
      $allSections.show();
      // $allSections.removeClass('filtered-out'); // 如果使用 class 控制
    } else {
      $allSections.each(function() {
        const sectionIdentifier = $(this).data('category') || $(this).data('tag'); // 尝试获取 data-category，如果没有则获取 data-tag
        if (sectionIdentifier && activeFilters.includes(sectionIdentifier)) {
          // 确保获取到了标识符，并且它在激活的筛选器中
          $(this).show();
          // $(this).removeClass('filtered-out'); // 如果使用 class 控制
        } else {
          $(this).hide();
          // $(this).addClass('filtered-out'); // 如果使用 class 控制
        }
      });
    }
  });

  // 初始状态，确保 "显示全部" 是激活的
  // (HTML 中已经默认添加了 active 类)
  // $('.filter-controls .filter-button[data-filter="all"]').addClass('active');

});