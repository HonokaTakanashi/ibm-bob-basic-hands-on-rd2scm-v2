# 実装計画書: FAQサイトのBobブランド化とダークテーマ追加

## 基本情報

* 仕様書: 20261109-faq-website-theme-spec.md
* 作成日時: 2026-11-09T14:41:54+09:00
* 更新日時: 2026-11-09T14:43:03+09:00
* 作成者: Bob
* ステータス: Approved

## 変更ファイル一覧

| ファイル | 変更種別 | 変更概要 |
| --- | --- | --- |
| `index.html` | 修正 | ロゴリンク化、Bob配色（青→紫グラデーション）、ダークテーマ（CSS変数、切替ボタン、JS） |
| `specs/20261109-faq-website-theme-spec.md` | 新規 | 仕様書 |
| `specs/20261109-faq-website-theme-plan.md` | 新規 | 実装計画書 |

## 実装手順

1. **テーマ初期化スクリプト（`<head>` 内）**
   * `<style>` の前に小さなインラインスクリプトを追加する。
   * `localStorage('theme')` が `light` / `dark` ならそれを使い、なければ `matchMedia('(prefers-color-scheme: dark)')` で決定する。
   * 結果を `document.documentElement.dataset.theme` に設定する。`localStorage` アクセスは `try/catch` で保護する。

2. **CSS変数の整理**（`:root` と `[data-theme="dark"]`）
   * 追加:
     * `--brand-blue`、`--brand-purple`、`--brand-gradient`
   * 固定色を変数化:
     * `--cds-ui-hover`（`#fafafa` / `#e8e8e8` 用）
     * `--cds-ui-divider`（`#f0f0f0` 用）
     * `--code-bg`
     * `--answer-bg`（`#ffffff` 固定の置換）
     * `--search-bg` と `--search-text`
   * `[data-theme="dark"]` で上書き:
     * 背景 `#161616`、カード `#262626`、ボーダー `#393939`
     * テキスト `#f4f4f4` / `#c6c6c6` / `#8d8d8d`
     * リンクとフォーカス: 明るい青紫（例 `#78a9ff`）
     * ハイライト: 暗背景でも読める黄系
     * シャドウ: 暗色向けに強める
   * `color-scheme: light` / `dark` を指定する。

3. **ブランド配色の適用**
   * `.hero` 背景: 暗色ベース + ブランドグラデーション（低不透明度のオーバーレイ）
   * `header` 下端: 3px のグラデーションライン（`border-image` または `::after`）
   * `.cat-btn.active`、`.lang-btn.active`、`.empty-reset-btn`: `--brand-gradient` 背景
   * `.faq-category-title::before`: グラデーションの縦バー
   * ホバー時の色: 既存のホバー変数を維持しつつ、グラデーションの視認性を保つ

4. **ヘッダーHTML変更**
   * ロゴ `<img>` のみを `<a class="header-logo-link" href="https://www.ibm.com/products/bob" target="_blank" rel="noopener noreferrer" id="logoLink">` で囲む。
   * タイトル文字 `<span id="headerTitle">` はリンク外のテキストにする。
   * `.header-logo` を `<a>` から `<div>` に変更し、既存の見た目を維持する。
   * ロゴ画像のサイズを 32px から 40px に変更する。
   * 言語切替の隣に `<button id="themeToggle" class="theme-toggle" type="button">` を追加する。
     * 月と太陽のインラインSVGを両方置き、CSSで `data-theme` に応じて表示を切り替える。
   * `.header-actions` ラッパーで言語切替とテーマボタンを横並びにする。

5. **JavaScript変更**
   * `UI_I18N` に追加:
     * `logoAriaLabel`（例: ja「IBM Bob 公式ページ（新しいタブで開く）」/ en「IBM Bob official page (opens in a new tab)」）
     * `themeToLight` と `themeToDark`（`aria-label` / `title` 用）
   * `updateUIText()` に追加:
     * ロゴリンクの `aria-label`
     * テーマボタンの `aria-label` / `title`（現在のテーマに応じて「ライトに切替」/「ダークに切替」）
   * テーマボタンのクリックハンドラを追加:
     * `data-theme` をトグルする。
     * `localStorage` に保存する（`try/catch` で保護）。
     * ボタンのラベルを更新する。

6. **レスポンシブ調整**
   * 768px 以下で `.header-actions` の gap と `.lang-btn` の padding を調整する。
   * 375px 幅でもロゴ、タイトル、言語切替、テーマボタンが折り返しや溢れなく収まるようにする。タイトルは必要に応じてフォントを縮小する。

7. **検証**（下記「検証計画」を実施）

## GUI実装

* 対象コンポーネント: Header（ロゴリンク、言語切替、テーマ切替ボタン）、Hero、カテゴリタブ、FAQカード、検索入力、空状態、Footer
* スタイル: CSS Variables を `:root` と `[data-theme="dark"]` で定義する。ブランドグラデーションは変数化して再利用する。
* 状態管理: `<html data-theme>` と `localStorage('theme')`。既存の Lang、Search、Category、OpenItems は変更しない。
* 画面遷移: ロゴは外部ページを新しいタブで開く。それ以外は変更なし。
* レスポンシブ対応: 既存の 768px ブレークポイントを維持し、ヘッダーのアクション群を縮小対応する。

## テストの追加・更新

* 単一静的HTMLのため、自動テストは追加しない。ブラウザでの手動検証とコンソールエラー確認を行う。

## 検証計画

1. **ロゴ**:
   * `href` / `target` / `rel` の属性確認
   * 実寸が約40pxであること
   * タイトル文字が `<a>` の外にあること
2. **配色**:
   * ライトとダークでヒーロー、アクティブタブ、言語ボタン、見出しバーにグラデーションが出ること
3. **ダークテーマ**:
   * ボタンで切り替わること
   * `data-theme` と `localStorage` の値が更新されること
   * 再読み込み後も維持されること
   * `prefers-color-scheme: dark` のエミュレーションで、保存値なしの初回がダークになること
   * `code`、`mark`、検索入力、空状態、ホバー、フォーカスの視認性
4. **コントラスト**:
   * 主要な文字色と背景色の組み合わせを目視確認し、可能なら `lighthouse_audit`（accessibility）で検証する
5. **回帰**:
   * 検索、言語切替（テーマボタンのラベル追従を含む）、アコーディオン、カテゴリ絞込み、すべて開く/閉じる
6. **レスポンシブ**:
   * 375px と 1280px 幅でスクリーンショット確認（ライトとダーク）
7. **コンソール**:
   * エラーなし

## 移行・ロールバック

* `index.html` は git 未追跡のため、`git checkout` では戻せない。実装開始前に `cp index.html /tmp/index.html.bak` で退避し、問題があればこの退避ファイルで戻す。

## 未解決事項

* なし
