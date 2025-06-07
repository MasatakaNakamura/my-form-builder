# my-form-builder

## 概要

my-form-builderは、ReactとMaterial-UIを用いたドラッグ＆ドロップ式のフォームビルダーです。Webブラウザ上でフォーム部品（テキスト入力、テキストエリア、チェックボックス、ラジオボタン）を自由に配置し、リアルタイムでプレビューやJSON出力が可能です。

## 主な機能
- ドラッグ＆ドロップでフォーム部品を追加・並び替え
- 右側でフォームのプレビュー表示
- 生成されたフォーム定義のJSON出力

## 動作環境
- Node.js 16以上推奨
- npm 7以上推奨

## セットアップ手順

1. リポジトリをクローン
   ```sh
   git clone git@github.com:MasatakaNakamura/my-form-builder.git
   cd my-form-builder/my-form-builder
   ```

2. 依存パッケージのインストール
   ```sh
   npm install
   ```

3. 開発サーバーの起動
   ```sh
   npm start
   ```

4. ブラウザでアクセス
   - http://localhost:3000 を開くとアプリが表示されます。

## ディレクトリ構成

```
my-form-builder/
  ├─ my-form-builder/
      ├─ src/
          ├─ components/
              ├─ FormBuilder.js
              ├─ FormRenderer.js
              └─ builder/
                  ├─ Canvas.js
                  ├─ CanvasItem.js
                  ├─ Toolbox.js
                  └─ ToolboxItem.js
          ├─ App.js
          ├─ index.js
          └─ ...
```

## 主要依存パッケージ
- react
- react-dom
- react-scripts
- @mui/material
- @emotion/react, @emotion/styled
- react-dnd, react-dnd-html5-backend
- uuid

## ライセンス
このプロジェクトはMITライセンスです。
