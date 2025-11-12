import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// MCPサーバーを作成
const server = new Server(
  {
    name: "addition-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 利用可能なツール一覧を返すハンドラ
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add",
        description: "2つの数値を足し算します",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "1つ目の数値",
            },
            b: {
              type: "number",
              description: "2つ目の数値",
            },
          },
          required: ["a", "b"],
        },
      },
    ],
  };
});

// ツール実行のハンドラ
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "add") {
    const a = Number(request.params.arguments?.a);
    const b = Number(request.params.arguments?.b);
    const result = a + b;

    return {
      content: [
        {
          type: "text",
          text: `${a} + ${b} = ${result}`,
        },
      ],
    };
  }

  return {
    isError: true,
    content: [
      {
        type: "text",
        text: `Unknown tool: ${request.params.name}`,
      },
    ],
  };
});

// 標準入出力でクライアントと通信
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("[MCP Server] addition-server started");
