
function component () {
  var element = document.createElement('div');

  element.innerHTML = 'Hello dear~';

  return element;
}

document.body.appendChild(component());