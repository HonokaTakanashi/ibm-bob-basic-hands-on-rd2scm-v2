# 実装計画書: 日本語FAQサイト

## 基本情報

* 仕様書: 20261021-faq-site-spec.md
* 作成日時: 2026-10-21T12:36:27+09:00
* 更新日時: 2026-10-21T12:37:29+09:00
* 作成者: IBM Bob
* ステータス: Approved

## 変更ファイル一覧

| ファイル         | 変更種別 | 変更概要 |
| ------------ | ---- | ---- |
| faq-data.js  | 新規   | `qa.md` 全17問を日本語化した `FAQ_DATA`（カテゴリ配列）を定義 |
| index.html   | 新規   | ページ骨格（ヘッダー、検索、FAQ描画領域、空状態、フッター）。`style.css`、`faq-data.js`、`script.js` を通常の `<script>` で読み込む |
| style.css    | 新規   | IBM風スタイル、アコーディオン、レスポンシブ、フォーカス表示 |
| script.js    | 新規   | FAQのDOM生成、アコーディオン開閉、検索絞り込み、空状態・件数表示 |

## 実装手順

1. `faq-data.js` を作成する。
   * `var FAQ_DATA = [{ id, title, items: [{ question, answer: [blocks] }] }]` 形式
   * ブロック: `{ type: "p", text: [inline...] }` / `{ type: "ul", items: [[inline...], ...] }`
   * インライン: `{ text, bold?, code? }`
   * カテゴリ: 一般(5) / 使い方(8) / 高度な機能(2) / トラブルシューティング(2)
   * です・ます調、製品名・コード表記は原文のまま
2. `index.html` を作成する（`lang="ja"`、viewport、検索 `<label>`/`<input type="search">`、`aria-live` の件数表示、`#faq-root`、`#empty-state`、フッター）。
3. `style.css` を作成する（CSS変数、IBM Blue `#0f62fe`、最大幅800px、タップ領域44px以上、フォーカスリング、メディアクエリ）。
4. `script.js` を作成する。
   * `renderInline` / `renderBlocks` は `createElement` + `textContent` のみ使用
   * 質問は `<button aria-expanded aria-controls>` と回答 `<div id hidden>` で構成
   * 検索: 前後空白除去、`toLowerCase` で質問文・回答文（ブロックから抽出したプレーンテキスト）に部分一致
   * 検索中は一致項目の回答を開き、0件カテゴリは非表示。検索語クリアで元の開閉状態に戻す必要はなく、全件表示かつ全て閉じた状態に戻す
   * 0件時は空状態メッセージを表示
5. ブラウザで検証し、不具合があれば修正する。

## GUI実装

* 対象コンポーネント: `index.html` 内の検索ボックス、カテゴリセクション、アコーディオン項目、空状態領域（`script.js` が動的生成）
* スタイル: `style.css` にCSS変数でカラー・余白を定義。白/ライトグレー基調、IBM Blueアクセント、システムフォント（Noto Sans JP, Hiragino Sans, Yu Gothic, sans-serif）
* 状態管理: DOM属性（`aria-expanded`、`hidden`）のみで管理。グローバル状態は検索語のみ
* 画面遷移: なし（単一ページ）
* レスポンシブ対応: モバイルファースト。360px〜1280px以上で横スクロールなし。本文最大幅800px中央寄せ

## テストの追加・更新

* 自動テストは追加しない（ビルド・テスト基盤がなく、仕様書の対象外のため）。
* 手動テストで代替する（検証計画参照）。

## 検証計画

1. `qa.md` の質問数（17）と `faq-data.js` の項目数を `execute_command`（grep/スクリプト）で照合する。
2. Chrome DevTools で `file://` の `index.html` を開く。
3. 全17問・4カテゴリの表示、英語の残りがないことを確認する。
4. マウス/キーボード（Tab, Enter, Space）で開閉できること、`aria-expanded` が更新されることを確認する。
5. 検索: 一致（例: 「MCP」）、不一致（例: 「zzzz」→空状態）、クリアで全件に戻ることを確認する。
6. 360px / 768px / 1280px で横スクロールや崩れがないことを確認する。
7. コンソールエラーおよびネットワーク要求（外部通信なし）を確認する。
8. Lighthouse（アクセシビリティ）を実行する。

## 移行・ロールバック

* 新規ファイルのみの追加で、既存ファイルへの影響はない。
* ロールバックは新規4ファイルの削除で行える。

## 未解決事項

* なし（翻訳の訳語は実装後のレビューで調整可能）。
