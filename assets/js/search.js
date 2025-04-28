---
# 空的 Front Matter
---
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('results-container');

  // 检查 searchInput 和 resultsContainer 是否实际存在于页面上
  if (!searchInput || !resultsContainer) {
      console.error("Search input or results container not found on this page.");
      return; // 如果页面上没有搜索框，则不执行后续操作
  }

  var sjs = SimpleJekyllSearch({
    searchInput: searchInput,                     // 使用上面获取的变量
    resultsContainer: resultsContainer,           // 使用上面获取的变量
    json: '{{ site.baseurl }}/search.json',       // Liquid 标签现在会被处理
    searchResultTemplate: '<li><a href="{url}">{title}</a><span class="search-date">{date}</span></li>',
    noResultsText: '<li class="no-results">无结果</li>',
    limit: 10,
    fuzzy: false
  });

  // 点击页面其他地方隐藏结果框
  document.addEventListener('click', function(event) {
    // 如果点击的不是搜索框或结果框内部
    if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
      resultsContainer.style.display = 'none'; 
    }
  });

  // 搜索框获得焦点时显示结果框
  searchInput.addEventListener('focus', function() {
     // 只有当结果容器有内容（比如上次搜索有结果或显示"无结果"）时才显示
     if (resultsContainer.innerHTML.trim() !== '') { 
        resultsContainer.style.display = 'block';
     }
  });

   searchInput.addEventListener('input', function() {
     if (searchInput.value.trim() !== '') { // 只有在输入内容后才强制显示
        resultsContainer.style.display = 'block';
     } else {
         // 如果输入框为空，可以考虑隐藏结果框或让 SimpleJekyllSearch 处理
         resultsContainer.style.display = 'none'; 
     }
   });

});