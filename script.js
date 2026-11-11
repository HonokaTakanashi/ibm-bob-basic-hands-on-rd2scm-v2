document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearBtn');
  const noResults = document.getElementById('noResults');
  const faqCategories = document.querySelectorAll('.faq-category');
  const faqItems = document.querySelectorAll('.faq-item');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  // ==========================================
  // テーマ管理（ダーク / ライト）
  // ==========================================
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function applyTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'
      );
    }
    if (save) {
      try {
        localStorage.setItem('bob-faq-theme', theme);
      } catch (e) {
        console.warn('localStorage is not accessible:', e);
      }
    }
  }

  // 初期テーマ状態の反映
  const initialTheme = getCurrentTheme();
  applyTheme(initialTheme, false);

  // テーマ切り替えボタンのクリックイベント
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = getCurrentTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }

  // OSのテーマ設定変更を検知（手動保存されていない場合、または動的追従）
  if (window.matchMedia) {
    const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeMediaQuery.addEventListener('change', (e) => {
      try {
        const savedTheme = localStorage.getItem('bob-faq-theme');
        if (!savedTheme) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch (err) {
        // ignore
      }
    });
  }

  // ==========================================
  // カテゴリ & 検索 & アコーディオン
  // ==========================================
  let activeCategory = 'all';

  // アコーディオン開閉制御
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      if (isOpen) {
        item.classList.remove('is-open');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 全アイテムのアコーディオンを閉じる
  function closeAllAccordions() {
    faqItems.forEach((item) => {
      item.classList.remove('is-open');
      const btn = item.querySelector('.faq-question');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  // カテゴリ選択状態のUI更新
  function setActiveCategoryButton(targetCategory) {
    activeCategory = targetCategory;
    filterBtns.forEach((btn) => {
      if (btn.dataset.category === targetCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // カテゴリフィルタリング処理
  function applyCategoryFilter(category) {
    setActiveCategoryButton(category);

    // 検索入力と結果メッセージをリセット
    searchInput.value = '';
    clearBtn.hidden = true;
    noResults.hidden = true;
    closeAllAccordions();

    faqCategories.forEach((catSection) => {
      const catName = catSection.dataset.category;
      if (category === 'all' || catName === category) {
        catSection.style.display = '';
        // カテゴリ内のアイテムをすべて表示状態に
        const items = catSection.querySelectorAll('.faq-item');
        items.forEach((item) => {
          item.style.display = '';
        });
      } else {
        catSection.style.display = 'none';
      }
    });
  }

  // カテゴリボタンのクリックイベント
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      applyCategoryFilter(category);
    });
  });

  // リアルタイム検索処理
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    // 検索入力時はカテゴリを「すべて」にリセット
    if (activeCategory !== 'all') {
      setActiveCategoryButton('all');
    }

    // クリアボタンの表示切り替え
    if (query.length > 0) {
      clearBtn.hidden = false;
    } else {
      clearBtn.hidden = true;
    }

    let totalVisibleCount = 0;

    faqCategories.forEach((category) => {
      const itemsInCategory = category.querySelectorAll('.faq-item');
      let visibleInCategory = 0;

      itemsInCategory.forEach((item) => {
        const questionText = item.querySelector('.faq-question-text')?.textContent.toLowerCase() || '';
        const answerText = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';

        const isMatch = query === '' || questionText.includes(query) || answerText.includes(query);

        if (isMatch) {
          item.style.display = '';
          visibleInCategory++;
          totalVisibleCount++;

          // 検索ワード入力時は該当項目の回答を自動展開して視認性を高める
          if (query !== '') {
            item.classList.add('is-open');
            const btn = item.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'true');
          }
        } else {
          item.style.display = 'none';
        }
      });

      // カテゴリ内に該当項目がなければカテゴリごと非表示
      if (visibleInCategory === 0 && query !== '') {
        category.style.display = 'none';
      } else {
        category.style.display = '';
      }
    });

    // 検索結果0件の表示切り替え
    if (totalVisibleCount === 0 && query !== '') {
      noResults.hidden = false;
    } else {
      noResults.hidden = true;
    }
  }

  // 検索入力イベント
  searchInput.addEventListener('input', handleSearch);

  // クリアボタンのクリック
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    handleSearch();
    searchInput.focus();
    closeAllAccordions();
  });
});
