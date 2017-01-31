document.addEventListener('DOMContentLoaded', () => {
  var xhr = new XMLHttpRequest();
  var inputEl = document.getElementById("search");
  var resultsListEl = document.getElementsByClassName("results-list")[0];
  var noResultsEl = document.getElementsByClassName("no-results")[0];

  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      clearResults();
      var dataJSON = JSON.parse(xhr.responseText);
      if(dataJSON.length > 0){
        populateResults(dataJSON);
      } else {
        noResultsEl.style.display = "block";
      }
    } else if(xhr.readyState === 4 && xhr.status === 400) {
      clearResults();
      noResultsEl.style.display = "block";
    }
  });

  //send request on input change after 500ms
  inputEl.addEventListener("input", () => {
    if(inputEl.value.length > 1){
      delay(() => {
        fetchResults(inputEl.value, xhr);
      }, 500 );
    } else {
      clearResults();
    }
  });

  function populateResults(data){
    var vikiUrl = "https://viki.com/";
    resultsListEl.style.display = "block";
    data.forEach(item => {
      var resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `

      <a href=${vikiUrl + item.u.w}>
        <img src=${item.i} class="result-img"/>
        ${item.tt} [${item.t}]
      </a>
      <div>
      `;

      resultsListEl.appendChild(resultItem);
    });
  }

  function clearResults(){
    noResultsEl.style.display = "none";
    resultsListEl.style.display = "none";
    while (resultsListEl.firstChild) {
        resultsListEl.removeChild(resultsListEl.firstChild);
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
