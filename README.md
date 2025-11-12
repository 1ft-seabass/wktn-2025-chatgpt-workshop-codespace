# wktn-2025-chatgpt-workshop-codespace

ChatGPT ハンズオン用のサンプルコード集

## ファイル構成

### 基本サンプル
- `app01.js` - Node.js の動作確認用
- `sample01.js` - ChatGPT API の基本的な使い方
- `sample02.js` - Tools（Function Calling新記法）を使った IoT 制御
- `sample03.js` - Tools を使った RGB 色名変換
- `sample04.js` - Vision API を使った画像認識

### MCP サンプル
- `mcp-example/` - Model Context Protocol のサンプル
  - 詳細は [mcp-example/README.md](./mcp-example/README.md) を参照

## セットアップ

```bash
npm install
```

## 使い方

各サンプルファイルの冒頭にある `OPENAI_API_KEY` を自分のAPIキーに書き換えてください。

```javascript
const OPENAI_API_KEY = "OPENAI_API_KEY";  // ← ここを書き換え
```

実行:
```bash
node sample01.js
```

## MCP サンプルの使い方

mcp-example フォルダに移動してセットアップ:
```bash
cd mcp-example
npm install
```

詳細は [mcp-example/README.md](./mcp-example/README.md) を参照。