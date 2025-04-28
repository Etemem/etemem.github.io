$(document).ready(function() {
  // --- 筛选按钮点击事件 ---
  $('.filter-controls .filter-button').on('click', function() {
    const $this = $(this);
    const filterValue = $this.data('filter');
    const $allSections = $('.category-section'); // 获取所有文章分类区域
    const $filterButtons = $('.filter-controls .filter-button'); // 获取所有筛选按钮

    // --- 处理按钮激活状态 ---
    if (filterValue === 'all') {
      // 如果点击的是 "显示全部"
      $filterButtons.removeClass('active'); // 移除其他按钮的 active 类
      $this.addClass('active'); // 激活 "显示全部" 按钮
    } else {
      // 如果点击的是具体分类按钮
      $('.filter-controls .filter-button[data-filter="all"]').removeClass('active'); // 取消 "显示全部" 的激活状态
      $this.toggleClass('active'); // 切换当前按钮的激活状态

      // 检查是否还有其他按钮被选中，如果没有，则激活 "显示全部"
      if ($('.filter-controls .filter-button.active').length === 0) {
        $('.filter-controls .filter-button[data-filter="all"]').addClass('active');
      }
    }

    // --- 获取当前所有激活的筛选值 ---
    let activeFilters = [];
    $('.filter-controls .filter-button.active').each(function() {
      activeFilters.push($(this).data('filter'));
    });

    // --- 执行筛选 ---
    if (activeFilters.includes('all') || activeFilters.length === 0) {
      // 如果 "显示全部" 被激活，或者没有按钮被激活，则显示所有区域
      $allSections.show();
      // $allSections.removeClass('filtered-out'); // 如果使用 class 控制
    } else {
      // 否则，根据选中的筛选值显示/隐藏
      $allSections.each(function() {
        const sectionCategory = $(this).data('category');
        if (activeFilters.includes(sectionCategory)) {
          $(this).show();
          // $(this).removeClass('filtered-out'); // 如果使用 class 控制
        } else {
          $(this).hide();
          // $(this).addClass('filtered-out'); // 如果使用 class 控制
        }
      });
    }
  });

  // --- 初始状态：确保 "显示全部" 是激活的 ---
  // (HTML 中已经默认添加了 active 类, 此处可选)
  // $('.filter-controls .filter-button[data-filter="all"]').addClass('active');

});