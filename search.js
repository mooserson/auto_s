const TYPES = {
  film: "assets/film.svg",
  series: "assets/television.svg",
  person: "assets/person.svg",
  news_clip: "assets/newspaper.svg"
};

document.addEventListener('DOMContentLoaded', () => {
  var xhr = new XMLHttpRequest();
  var inputEl = document.getElementById("search-input");
  var resultsListEl = document.getElementsByClassName("results-list")[0];
  var noResultsEl = document.getElementsByClassName("no-results")[0];

  xhr.addEventListener("readystatechange", () => {
    //xhr done
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
      let query = inputEl.value;
      delay(() => {
        fetchResults(query);
      }, 300 );
    } else {
      xhr.abort();
      clearResults();
    }
  });

  function fetchResults(query) {
    var time = Date.now();
    var url = `https://api.viki.io/v4/search.json?per_page=5&app=100634a&with_people=true&c=${query}&t=${Date.now()}`;
    xhr.open('GET', url);

    //ensure delay does not fire request after clearing input
    if(inputEl.value.length > 1){
      startSpinner();
      xhr.send();
    }
  }

  function populateResults(data){
    var vikiUrl = "https://viki.com/";
    resultsListEl.style.display = "block";
    data.forEach(item => {
      var resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `
      <a href=${vikiUrl + item.u.w}>
        <img src=${item.i} class="result-img"/>
        ${item.tt}
      </a>
      <img src="${TYPES[item.t]}" class="type-img"/>
      `;
      resultsListEl.appendChild(resultItem);
      console.log(item.t);
    });
  }

  var spinnerEl = document.getElementsByClassName("spinner")[0];
  function  startSpinner(){
    spinnerEl.style.display = "inline";
  }

  function  stopSpinner(){
    spinnerEl.style.display = "none";
  }

  function clearResults(){
    noResultsEl.style.display = "none";
    resultsListEl.style.display = "none";
    stopSpinner();
    while (resultsListEl.firstChild) {
        resultsListEl.removeChild(resultsListEl.firstChild);
    }
  }


  //timer to wait for user to stop typing for n ms before firing AJAX
  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();
});
