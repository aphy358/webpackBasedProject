
import $ from 'jquery'

function component () {
  var element = document.createElement('div');

  element.innerHTML = 'Hello dear~';

  return element;
}

$('body').append(component());
//document.body.appendChild(component());