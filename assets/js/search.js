// assets/js/search.js
document.addEventListener('DOMContentLoaded', function () {
  var sjs = SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '{{ site.baseurl }}/search.json', // 确保路径正确
    searchResultTemplate: '<li><a href="{url}">{title}</a><span class="search-date">{date}</span></li>',
    noResultsText: '<li>无结果</li>',
    limit: 10, // 显示结果数量
    fuzzy: false, // 是否启用模糊搜索
    // 可以根据需要添加更多配置项
  });

  // 可选：添加逻辑，当点击页面其他地方时隐藏结果框
  document.addEventListener('click', function(event) {
    var resultsContainer = document.getElementById('results-container');
    var searchInput = document.getElementById('search-input');
    // 如果点击的不是搜索框或结果框内部
    if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
      resultsContainer.style.display = 'none'; // 隐藏结果
    }
  });
  // 可选：当搜索框获得焦点时显示结果框（如果之前隐藏了）
  searchInput.addEventListener('focus', function() {
     var resultsContainer = document.getElementById('results-container');
     if (resultsContainer.innerHTML.trim() !== '') { // 只有在有内容时才显示
        resultsContainer.style.display = 'block';
     }
  });
  // 可选：当输入时确保结果框可见
   searchInput.addEventListener('input', function() {
     var resultsContainer = document.getElementById('results-container');
     resultsContainer.style.display = 'block';
   });

});