/* global svg4everybody */

$(document).ready(() => {
  $('.order').on('click', () => {
    $(this).toggleClass('order--expanded');
  });

  svg4everybody();
});
