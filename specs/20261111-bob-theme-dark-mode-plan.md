# 実装計画書: FAQサイトへのBobロゴリンク追加・テーマカラー刷新・ダークテーマ対応

## 基本情報

* 仕様書: specs/20261111-bob-theme-dark-mode-spec.md
* 作成日時: 2026-11-11T05:58:05Z
* 更新日時: 2026-11-11T05:58:05Z
* 作成者: Bob
* 更新日時: 2026-11-11T05:58:05Z
* ステータス: Approved

## 変更ファイル一覧

| ファイル | 変更種別 | 変更概要 |
| --- | --- | --- |
| `index.html` | 修正 | ヘッダー上部バー（左上Bobロゴリンク、右上ダークモードトグルボタン）の追加、インラインテーマ初期化スクリプト |
| `style.css` | 修正 | Bobカラーパレット変数の追加、ダークモードスタイル（`[data-theme="dark"]`）、ヘッダー上部ナビ・トグルボタン・ロゴのスタイリング、UI各要素のカラー刷新 |
| `script.js` | 修正 | ダークモード切り替えイベントハンドラ、localStorage連動、システム設定検知の実装 |
| `specs/20261111-bob-theme-dark-mode-spec.md` | 新規 | 仕様書 |
| `specs/20261111-bob-theme-dark-mode-plan.md` | 新規 | 実装計画書 |

## 実装手順

1. **`index.html` のマークアップ更新**:
   * `<header class="header">` 内部に `.header-top-bar` コンテナを追加。
   * 左側に `bob.svg` を含む `<a href="https://www.ibm.com/products/bob" target="_blank" rel="noopener noreferrer" class="logo-link" aria-label="IBM Bob 公式サイト (別タブで開く)">` を配置。
   * 右側に `<button type="button" id="themeToggleBtn" class="theme-toggle-btn" aria-label="テーマを切り替える">` を配置（太陽・月のSVGアイコンを含む）。
   * 初期描画時のちらつき（FOUC）を防ぐため、`<head>` 内に簡易テーマ初期化スクリプトを追加。

2. **`style.css` のスタイル拡張**:
   * `:root` 変数を再構成し、Bob Blue (`#0f62fe`)、Bob Gradient (`linear-gradient(135deg, #0f62fe 0%, #a56eff 100%)`) を定義。
   * `[data-theme="dark"]` セレクタでダークモード時の背景色、カード色、テキスト色、ボーダー色、入力欄色を定義。
   * `.header-top-bar`, `.logo-link`, `.bob-logo`, `.theme-toggle-btn` のスタイリングを追加。
   * カテゴリボタンや検索バー、アコーディオンのフォーカス・アクティブ状態にBobグラデーション/ブルーを適用。
   * モバイル対応のレスポンシブスタイルを調整。

3. **`script.js` のテーマ制御ロジック実装**:
   * テーマ判定（localStorage → prefers-color-scheme）と適用関数 `setTheme(theme)` を定義。
   * トグルボタンのクリックイベントで現在のテーマを反転し、localStorageに保存してUIアイコンを同期。
   * OSのテーマ変更リスナー（`matchMedia.addEventListener('change', ...)`）を追加。
   * 既存のアコーディオン・検索・カテゴリフィルター機能との共存を確認。

4. **検証とテスト**:
   * ロゴリンクのクリック動作と別タブ遷移を確認。
   * テーマ切り替えの即時反映とUI視認性・コントラストを確認。
   * リロード時・新規タブ時での設定維持を確認。
   * 検索・カテゴリ絞り込み・アコーディオン開閉が両テーマで問題なく動作することを確認。

## GUI実装

* 対象コンポーネント:
  * ヘッダー上部ナビゲーションバー（ロゴリンク、テーマ切り替えボタン）
  * サイト全体（背景、ヘッダー、検索バー、カテゴリボタン、FAQカード、フッター）
* スタイル:
  * Bob IBM Blue (`#0f62fe`)、Bob Purple (`#a56eff`)
  * CSSカスタムプロパティを活用したテーマ切り替え
* 状態管理:
  * `document.documentElement.setAttribute('data-theme', 'dark' | 'light')`
  * `localStorage.getItem('bob-faq-theme')`
* 画面遷移:
  * サイト内遷移なし。ロゴクリックで `https://www.ibm.com/products/bob` を新規タブで開く。
* レスポンシブ対応:
  * モバイル幅（640px以下）でもヘッダー上部バーの左右配置が崩れないようフレックスボックスで調整。

## テストの追加・更新

* 手動UIテスト:
  1. ロゴクリックテスト（別タブでIBM Bob公式ページが開くこと）
  2. テーマ切り替えテスト（ライト ↔ ダークの即時切り替え、アイコンの切り替え）
  3. 永続化テスト（リロード後も選択テーマが維持されること）
  4. 機能連動テスト（ダークモード下での検索、カテゴリ切り替え、アコーディオン開閉）
  5. レスポンシブテスト（スマホ・タブレット表示での崩れがないこと）

## 検証計画

* ブラウザでの実機検証（ローカルプレビュー）
* Chrome / Safari等での外観・動作確認

## 移行・ロールバック

* 静的ファイル（HTML/CSS/JS）のみの改修であるため、Gitによる変更前のコミットへのリバートで即時ロールバック可能。

## 未解決事項

* なし。
