var init = (function() {
  var homeButton = document.getElementById('home');

  var handleClickHome = function(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  homeButton.addEventListener('click', handleClickHome);
})();

document.addEventListener("DOMContentLoaded", init);

