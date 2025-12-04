// File: assets/js/common.js
// This file injects common header and footer into each page so we can reuse UI.
(function () {
    // header HTML as template string
    var headerHTML = `\n <header class="site-header">\n <nav>\n <a href="index.html">Home</a>\n <a href="list.html">List</a>\n <a href="about.html">About</a>\n </nav>\n </header>\n `;

    // footer HTML as template string
    var footerHTML = `\n <footer class="site-footer">\n <small>Copyright &copy; 2025 Your Name. All rights reserved.</small>\n </footer>\n `;

    // insert header if element exists
    var headerEl = document.getElementById('site-header'); // find site-header placeholder
    if (headerEl) headerEl.innerHTML = headerHTML; // inject header

    // insert footer if element exists
    var footerEl = document.getElementById('site-footer'); // find site-footer placeholder
    if (footerEl) footerEl.innerHTML = footerHTML; // inject footer
}) (); //IIFE to avoid polluting global scope