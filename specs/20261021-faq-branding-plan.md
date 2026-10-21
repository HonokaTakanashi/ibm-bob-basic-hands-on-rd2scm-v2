# 実装計画書: FAQサイト Bobブランディング追加（ロゴ・テーマカラー・ダークテーマ）

## 基本情報

* 仕様書: 20261021-faq-branding-spec.md
* 作成日時: 2026-10-21T12:49:34+09:00
* 更新日時: 2026-10-21T12:54:52+09:00
* 作成者: Bob
* ステータス: Approved

## 変更ファイル一覧

| ファイル | 変更種別 | 変更概要 |
| --- | --- | --- |
| `index.html` | 修正 | ヘッダー構造変更（ロゴ・リンク・トグルボタン追加）、FOUC防止インラインscript追加 |
| `style.css` | 修正 | テーマカラー変数更新・ダークテーマ CSS 追加 |

## 実装手順

1. **`style.css` を修正**
   - `:root` にグラデーション用変数 `--accent-sub: #a56eff` を追加
   - `.site-header` のトップボーダーをグラデーション（Blue → Purple）に変更（`border-top` → `background` + `::before` 擬似要素 または `border-image`）
   - `[data-theme="dark"]` スコープでダークテーマ用変数を定義
   - `@media (prefers-color-scheme: dark)` でシステム設定自動対応（`data-theme` 未指定時のみ）

2. **`index.html` を修正**
   - `<body>` 直後にインライン `<script>` を追加（localStorage からテーマを読み込み `<html>` の `data-theme` を即時設定 → FOUC 防止）
   - `.site-header` 内の `.container` をフレックスレイアウトに変更
   - 左側: Bob SVG ロゴを `<a>` → `<img>` でマークアップ
   - 中央: タイトル・サブタイトルを `<div>` でラップ
   - 右側: ダークテーマトグルボタン `<button id="theme-toggle">` を追加
   - `<script src="script.js">` の後にテーマ切り替えスクリプトをインラインで追記（または別ファイル）

3. **テーマ切り替えスクリプトを `script.js` に追記**
   - `#theme-toggle` ボタンのクリックで `html[data-theme]` を切り替え
   - 選択状態を `localStorage.setItem("theme", ...)` で保存
   - ボタンの `aria-pressed` と `aria-label` を動的に更新

## GUI実装

* 対象コンポーネント: `index.html` ヘッダー、`style.css` テーマ変数
* スタイル:
  - ヘッダー `.site-header` → `position: relative`
  - `.container` 内を `display: flex; align-items: center; gap: 16px;` に変更
  - Bob ロゴ `img`: `height: 48px; width: auto; display: block;`
  - トグルボタン: `margin-left: auto;` で右端に配置、既存フォーカス/ホバースタイルを適用
* 状態管理:
  - `html[data-theme="dark"]` 属性で CSS 変数を切り替え
  - `localStorage` キー: `"theme"`（値: `"dark"` / `"light"`）
  - 初期値: `localStorage` に値があればそれを優先、なければ `prefers-color-scheme` を参照
* 画面遷移: ロゴクリック → `target="_blank"` で外部リンク
* レスポンシブ対応: 既存の `max-width: 800px` を踏襲、モバイルでもロゴ・ボタン同行表示

## テストの追加・更新

* 既存の自動テストなし（静的 HTML サイト）
* 目視確認を検証計画で実施

## 検証計画

1. ブラウザでファイルを開き、Bob SVG がヘッダー左上に表示されることを確認
2. ロゴクリックで `https://www.ibm.com/products/bob` が新規タブで開くことを確認
3. ヘッダートップボーダーが Blue → Purple グラデーションになっていることを確認
4. トグルボタンをクリックし、ライト/ダーク切り替えを確認
5. DevTools で `prefers-color-scheme: dark` をエミュレートし、初期表示がダークになることを確認
6. ページ再読み込み後にテーマ設定が維持されることを確認
7. 検索・アコーディオン機能が引き続き動作することを確認

## 移行・ロールバック

* 既存ファイルは git で管理されているため、`git checkout` で元に戻せる

## 未解決事項

* なし
