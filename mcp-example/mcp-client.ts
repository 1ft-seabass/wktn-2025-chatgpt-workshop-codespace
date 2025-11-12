import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import * as readline from "readline/promises";

// OpenAI API キー（ここに自分のAPIキーを入力してください）
const OPENAI_API_KEY = "OPENAI_API_KEY";

// OpenAI クライアント初期化
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// MCP クライアント作成
const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "mcp-server.ts"],
});

const client = new Client(
  {
    name: "mcp-interactive-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

await client.connect(transport);
console.log("[MCP Client] サーバーに接続しました");

// MCP サーバーからツール一覧を取得
const toolsResult = await client.listTools();
console.log("\n利用可能なツール:");
console.log(JSON.stringify(toolsResult.tools, null, 2));

// readline でユーザー入力を受け付ける
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = await rl.question("\n質問を入力してください: ");
console.log(`\n質問: ${question}\n`);

// ChatGPT API に質問
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: question }],
  tools: toolsResult.tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  })),
});

const message = response.choices[0].message;
console.log("ChatGPT の応答:");
console.log(JSON.stringify(message, null, 2));

// ツール呼び出しがあれば実行
if (message.tool_calls) {
  for (const toolCall of message.tool_calls) {
    console.log(`\nツール実行: ${toolCall.function.name}`);
    console.log("引数:", toolCall.function.arguments);

    const result = await client.callTool({
      name: toolCall.function.name,
      arguments: JSON.parse(toolCall.function.arguments),
    });

    console.log("結果:");
    console.log(JSON.stringify(result, null, 2));
  }
} else {
  console.log("\n（ツールは呼び出されませんでした）");
}

rl.close();
await client.close();
console.log("\n[MCP Client] 終了");
