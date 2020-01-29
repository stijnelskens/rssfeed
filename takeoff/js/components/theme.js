'use strict';

const themeSwitch = document.getElementById('switchTheme');

if (themeSwitch) {
    initTheme(); // on page load, if user has already selected a specific theme -> apply it

    themeSwitch.addEventListener('change', function (event) {
        resetTheme(); // update color theme
    });

    function initTheme() {
        let darkThemeSelected = (localStorage.getItem('themeSwitch') !== null && localStorage.getItem('themeSwitch') === 'dark');
        // update checkbox
        themeSwitch.checked = darkThemeSelected;
        // update body data-theme attribute
        darkThemeSelected ? document.body.classList.add('theme-dark') : document.body.classList.remove('theme-dark');
    };

    function resetTheme() {
        if (themeSwitch.checked) { // dark theme has been selected
            document.body.classList.add('theme-dark');
            localStorage.setItem('themeSwitch', 'dark'); // save theme selection
        } else {
            document.body.classList.remove('theme-dark');
            localStorage.removeItem('themeSwitch'); // reset theme selection
        }
    };
}
