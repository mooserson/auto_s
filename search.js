document.addEventListener('DOMContentLoaded', () => {
  var xhr = new XMLHttpRequest();
  var input = document.getElementById("search");
  var resultsList = document.getElementsByClassName("results-list")[0];

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      populateResults(JSON.parse(xhr.responseText));
    } else if(xhr.readyState === 4 && xhr.status === 400) {
      clearResults();
    }
  });

  //send request on input change after 500ms
  input.addEventListener("input", () => {
    if(input.value.length > 1){
      delay(() => {
        fetchResults(input.value, xhr);
      }, 500 );
    } else {
      clearResults();
    }
  });

  function populateResults(data){
    data.forEach(item => {
      var resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `<img src=${item.i} class="result-img"/>`;
      resultsList.appendChild(resultItem);
    });
  }

  function clearResults(){
    while (resultsList.firstChild) {
      resultsList.removeChild(resultsList.firstChild);
    }
  }

  function fetchResults(query) {
    var time = Date.now();
    var url = `https://api.viki.io/v4/search.json?per_page=5&app=100634a&with_people=true&c=${query}&t=${Date.now()}`;
    xhr.open('GET', url);
    xhr.send();
  }

  //timer to wait for user to stop typing for N ms before firing AJAX
  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();
});
