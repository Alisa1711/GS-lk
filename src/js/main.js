/* global svg4everybody */

$(document).ready(() => {
  $('.order').on('click', function () {
    $(this).toggleClass('order--expanded');
  });

  $('.account-menu__button').on('click', () => {
    const menu = $('#account-menu__list');
    menu.slideToggle(300);
  });

  // Сортировка в таблице

  $('.sort__item').on('click', function () {
    if ($(this).hasClass('sort__item--active')) {
      $(this).toggleClass('sort__item--up');
    }
    $(this).addClass('sort__item--active').siblings().removeClass('sort__item--active sort__item--up');
  });

  // Чекбоксы в документах
  $(() => {
    const actions = $('.documents__actions');
    const downloadButton = $('.documents__download-all');
    const selectAllCheckbox = $('.select-all');
    let indeterminate = false;
    const checkboxes = $('.select-item');
    const getChecked = () => {
      let checked = 0;
      checkboxes.each(function () {
        checked = $(this).prop('checked') ? checked += 1 : checked;
      });
      return checked;
    };

    selectAllCheckbox.on('change', function () {
      if (indeterminate) {
        $(this).prop('checked', false);
      }
      checkboxes.prop('checked', $(this).prop('checked')).trigger('change');
      indeterminate = false;
    });

    checkboxes.on('change', function () {
      if (getChecked() === checkboxes.length) {
        selectAllCheckbox.prop({
          indeterminate: false,
          checked: true
        });
        indeterminate = false;
        downloadButton.removeClass('button-hide');
        actions.addClass('active');
      } else if (getChecked()) {
        selectAllCheckbox.prop({
          indeterminate: true,
          checked: false
        });
        indeterminate = true;
        downloadButton.removeClass('button-hide');
        actions.addClass('active');
      } else {
        selectAllCheckbox.prop({
          indeterminate: false,
          checked: false
        });
        indeterminate = false;
        downloadButton.addClass('button-hide');
        actions.removeClass('active');
      }
      $(this).closest('.documents__item').toggleClass('active', $(this).prop('checked'));
    });
  });

  svg4everybody(); // IE для svg-спрайта из внешнего файла

  $('select').niceSelect();
});
