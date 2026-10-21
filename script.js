(function () {
  "use strict";

  var root = document.getElementById("faq-root");
  var searchInput = document.getElementById("search-input");
  var emptyState = document.getElementById("empty-state");
  var resultCount = document.getElementById("result-count");

  var entries = []; // { itemEl, categoryEl, button, answer, searchText }
  var categoryEls = []; // { el, entries }

  function renderInline(parent, inlines) {
    inlines.forEach(function (part) {
      var node;
      if (part.code) {
        node = document.createElement("code");
      } else if (part.bold) {
        node = document.createElement("strong");
      } else {
        parent.appendChild(document.createTextNode(part.text));
        return;
      }
      node.textContent = part.text;
      parent.appendChild(node);
    });
  }

  function inlineText(inlines) {
    return inlines.map(function (part) { return part.text; }).join("");
  }

  function renderBlocks(container, blocks) {
    blocks.forEach(function (block) {
      if (block.type === "p") {
        var p = document.createElement("p");
        renderInline(p, block.text);
        container.appendChild(p);
      } else if (block.type === "ul") {
        var ul = document.createElement("ul");
        block.items.forEach(function (inlines) {
          var li = document.createElement("li");
          renderInline(li, inlines);
          ul.appendChild(li);
        });
        container.appendChild(ul);
      }
    });
  }

  function blocksText(blocks) {
    var parts = [];
    blocks.forEach(function (block) {
      if (block.type === "p") {
        parts.push(inlineText(block.text));
      } else if (block.type === "ul") {
        block.items.forEach(function (inlines) { parts.push(inlineText(inlines)); });
      }
    });
    return parts.join(" ");
  }

  function setOpen(entry, open) {
    entry.button.setAttribute("aria-expanded", open ? "true" : "false");
    entry.answer.hidden = !open;
  }

  function build() {
    FAQ_DATA.forEach(function (category, ci) {
      var section = document.createElement("section");
      section.className = "category";
      section.setAttribute("aria-labelledby", "cat-" + category.id);

      var h2 = document.createElement("h2");
      h2.className = "category-title";
      h2.id = "cat-" + category.id;
      h2.textContent = category.title;
      section.appendChild(h2);

      var catEntries = [];

      category.items.forEach(function (item, ii) {
        var uid = ci + "-" + ii;
        var itemEl = document.createElement("div");
        itemEl.className = "faq-item";

        var h3 = document.createElement("h3");
        h3.className = "faq-question";

        var button = document.createElement("button");
        button.type = "button";
        button.className = "faq-button";
        button.id = "q-" + uid;
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "a-" + uid);

        var label = document.createElement("span");
        label.textContent = item.question;
        var icon = document.createElement("span");
        icon.className = "faq-icon";
        icon.setAttribute("aria-hidden", "true");
        button.appendChild(label);
        button.appendChild(icon);
        h3.appendChild(button);

        var answer = document.createElement("div");
        answer.className = "faq-answer";
        answer.id = "a-" + uid;
        answer.setAttribute("role", "region");
        answer.setAttribute("aria-labelledby", button.id);
        answer.hidden = true;
        renderBlocks(answer, item.answer);

        itemEl.appendChild(h3);
        itemEl.appendChild(answer);
        section.appendChild(itemEl);

        var entry = {
          itemEl: itemEl,
          button: button,
          answer: answer,
          searchText: (item.question + " " + blocksText(item.answer)).toLowerCase()
        };
        button.addEventListener("click", function () {
          setOpen(entry, button.getAttribute("aria-expanded") !== "true");
        });
        entries.push(entry);
        catEntries.push(entry);
      });

      root.appendChild(section);
      categoryEls.push({ el: section, entries: catEntries });
    });
  }

  function applyFilter() {
    var query = searchInput.value.trim().toLowerCase();
    var searching = query.length > 0;
    var total = 0;

    categoryEls.forEach(function (cat) {
      var visible = 0;
      cat.entries.forEach(function (entry) {
        var match = !searching || entry.searchText.indexOf(query) !== -1;
        entry.itemEl.hidden = !match;
        setOpen(entry, searching && match);
        if (match) { visible++; }
      });
      cat.el.hidden = visible === 0;
      total += visible;
    });

    emptyState.hidden = total !== 0;
    resultCount.textContent = searching ? total + "件の質問が見つかりました。" : "";
  }

  build();
  searchInput.addEventListener("input", applyFilter);
})();

// ---- Theme toggle ----
(function () {
  "use strict";

  var html = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) { return; }

  function isDark() {
    return html.getAttribute("data-theme") === "dark" ||
      (!html.hasAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function applyTheme(dark) {
    html.setAttribute("data-theme", dark ? "dark" : "light");
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
    btn.setAttribute("aria-label", dark ? "ライトテーマに切り替え" : "ダークテーマに切り替え");
    btn.textContent = dark ? "☀️" : "🌙";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  // 初期状態を反映
  applyTheme(isDark());

  btn.addEventListener("click", function () {
    applyTheme(!isDark());
  });
})();
