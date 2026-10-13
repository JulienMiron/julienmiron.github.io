/* Injecte la navbar du site au début de <body>. Inclure avec :
     <link rel="stylesheet" href="../shared/site-navbar.css">
     <script src="../shared/site-navbar.js" defer></script>
   Les liens sont les mêmes que website.navbar dans _quarto.yml : en cas de
   changement là-bas, mettre à jour MENU ci-dessous. Le bouton de mode sombre
   n'est pas repris : les apps n'ont qu'un thème clair. */
(function () {
  var script = document.currentScript;
  if (!script) return;
  // apps/shared/site-navbar.js -> ../../ est la racine du site
  var root = new URL("../../", script.src).href;

  var MENU = [
    { text: "Accueil", href: "index.html" },
    { text: "Cours", items: [
      { text: "STT-1000", href: "https://julienmiron.ca/STT-1000/" },
      { text: "STT-1900", href: "https://julienmiron.ca/STT-1900/" },
      { text: "STT-1920", href: "https://julienmiron.ca/STT-1920/" },
      { text: "STT-4300", href: "https://julienmiron.ca/STT-4300/" },
      { text: "STT-2902", href: "cours/STT-2902/STT-2902.html" }
    ] },
    { text: "Outils", items: [
      { text: "Générateur de PDF d’examens", href: "apps/PDFExamens/index.html" },
      { text: "Partage DMS", href: "apps/PartageDMS/index.html" },
      { text: "GS vers Brio", href: "apps/GS-vers-Brio/index.html" }
    ] },
    { text: "Sites", href: "index.html#sites" },
    { text: "Dépôts", href: "index.html#depots" },
    { text: "À propos", href: "about.html" }
  ];

  var GITHUB = "https://github.com/JulienMiron";
  var GITHUB_PATH = "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z";

  function resolve(href) {
    return /^https?:/.test(href) ? href : root + href;
  }

  function isCurrent(href) {
    var target = new URL(resolve(href), location.href);
    return target.origin === location.origin &&
      target.pathname.replace(/\/index\.html$/, "/") === location.pathname.replace(/\/index\.html$/, "/");
  }

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    for (var k in attrs || {}) node.setAttribute(k, attrs[k]);
    return node;
  }

  function build() {
    var header = el("header", "site-navbar");
    var nav = el("nav", "site-navbar-container", { "aria-label": "Navigation du site" });

    var brand = el("div", "site-navbar-brand-container");
    var logoLink = el("a", "site-navbar-brand site-navbar-logo-link", { href: resolve("index.html") });
    var logo = el("img", "site-navbar-logo", { src: root + "img/logo.png", alt: "" });
    logoLink.appendChild(logo);
    var title = el("a", "site-navbar-brand", { href: resolve("index.html") });
    title.appendChild(el("span", "site-navbar-title"));
    title.firstChild.textContent = "Julien Miron";
    brand.appendChild(logoLink);
    brand.appendChild(title);

    var toggler = el("a", "site-navbar-toggler", {
      href: "#", role: "button", "aria-label": "Basculer la navigation", "aria-expanded": "false"
    });
    toggler.innerHTML = '<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M4 7h22M4 15h22M4 23h22"/></svg>';

    var collapse = el("div", "site-navbar-collapse");
    var list = el("ul", "site-navbar-nav");
    MENU.forEach(function (entry, i) {
      var li = el("li", "site-nav-item");
      if (entry.items) {
        var btn = el("a", "site-nav-link site-dropdown-toggle", {
          href: "#", role: "button", "aria-expanded": "false", "aria-haspopup": "true"
        });
        btn.textContent = entry.text;
        var menu = el("ul", "site-dropdown-menu");
        entry.items.forEach(function (item) {
          var itemLi = document.createElement("li");
          var a = el("a", "site-dropdown-item", { href: resolve(item.href) });
          a.textContent = item.text;
          if (isCurrent(item.href)) a.setAttribute("aria-current", "page");
          itemLi.appendChild(a);
          menu.appendChild(itemLi);
        });
        li.appendChild(btn);
        li.appendChild(menu);
      } else {
        var link = el("a", "site-nav-link", { href: resolve(entry.href) });
        link.textContent = entry.text;
        li.appendChild(link);
      }
      list.appendChild(li);
    });
    collapse.appendChild(list);

    var tools = el("div", "site-navbar-tools");
    var gh = el("a", "site-navbar-tool", { href: GITHUB, "aria-label": "Profil GitHub" });
    gh.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="' + GITHUB_PATH + '"/></svg>';
    tools.appendChild(gh);

    nav.appendChild(brand);
    nav.appendChild(toggler);
    nav.appendChild(collapse);
    nav.appendChild(tools);
    header.appendChild(nav);

    function closeMenus(except) {
      header.querySelectorAll(".site-nav-item.show").forEach(function (item) {
        if (item !== except) {
          item.classList.remove("show");
          item.firstChild.setAttribute("aria-expanded", "false");
        }
      });
    }

    list.querySelectorAll(".site-dropdown-toggle").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var item = btn.parentNode;
        var open = !item.classList.contains("show");
        closeMenus(item);
        item.classList.toggle("show", open);
        btn.setAttribute("aria-expanded", String(open));
      });
    });

    toggler.addEventListener("click", function (event) {
      event.preventDefault();
      var open = !header.classList.contains("open");
      header.classList.toggle("open", open);
      toggler.setAttribute("aria-expanded", String(open));
    });

    // Les liens role="button" ne réagissent pas à la barre d'espace par défaut
    header.querySelectorAll('[role="button"]').forEach(function (b) {
      b.addEventListener("keydown", function (event) {
        if (event.key === " ") { event.preventDefault(); b.click(); }
      });
    });

    document.addEventListener("click", function () { closeMenus(null); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenus(null);
    });

    return header;
  }

  function init() {
    document.body.classList.add("has-site-navbar");
    document.body.insertBefore(build(), document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
