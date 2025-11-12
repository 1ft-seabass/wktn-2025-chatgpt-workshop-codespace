# MCP Example

Model Context Protocol (MCP) の基礎体験サンプルです。

## ファイル構成

- mcp-server.ts - 足し算ツールを提供する MCP サーバー
- mcp-server-iot.ts - IoT デバイス制御ツールを提供する MCP サーバー
- mcp-execute.ts - 会話固定版のクライアント（動作確認用）
- mcp-client.ts - CLI で自由に質問できるクライアント

## セットアップ

```bash
cd mcp-example
npm install
```

各 TypeScript ファイルの冒頭にある API キーを自分のものに書き換えてください。

```typescript
const OPENAI_API_KEY = "OPENAI_API_KEY";  // ← ここを書き換え
```

## 使い方

動作確認（会話固定版）

```bash
npx tsx mcp-execute.ts
```

自由に質問（CLI手入力版）

```bash
npx tsx mcp-client.ts
```

IoT デバイス制御を試す場合は、mcp-client.ts の以下の部分を変更してください。

```typescript
// 足し算サーバー
args: ["tsx", "mcp-server.ts"],

// ↓ IoT サーバー
args: ["tsx", "mcp-server-iot.ts"],
```

質問例: 「ライトをオンにして」「電気を消して」

## MCP の仕組み

mcp-server.ts / mcp-server-iot.ts（MCPサーバー）

ツールを提供するサーバー。setRequestHandler でツール一覧とツール実行ロジックを登録します。

mcp-execute.ts / mcp-client.ts（MCPクライアント）

ChatGPT API と連携して MCP サーバーを使うクライアント。

- MCP サーバーに接続してツール一覧を取得
- ChatGPT API に質問
- ChatGPT がツールを選択して呼び出し
- MCP サーバーで実行して結果を取得

Function Calling との違い

- Function Calling: ツール定義をコード内に直接記述
- MCP: ツール定義をサーバー側で管理、クライアントは動的に取得

## 参考リンク

- MCP 公式: https://modelcontextprotocol.io/
- TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
