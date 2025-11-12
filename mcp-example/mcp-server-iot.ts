import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "iot-light-server",
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
        name: "turn_on_light",
        description: "ライトをオンにします",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "turn_off_light",
        description: "ライトをオフにします",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// ツール実行のハンドラ
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "turn_on_light") {
    // 実際のIoTデバイスに送信する処理は以下のように書く:
    //
    // const response = await fetch('https://your-iot-device.example.com/api/light', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ command: 'on' })
    // });
    //
    // 今回はシミュレーションなので返答のみ

    return {
      content: [
        {
          type: "text",
          text: "✅ ライトをオンにしました",
        },
      ],
    };
  }

  if (request.params.name === "turn_off_light") {
    // 実際のIoTデバイスに送信する処理は以下のように書く:
    //
    // const response = await fetch('https://your-iot-device.example.com/api/light', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ command: 'off' })
    // });

    return {
      content: [
        {
          type: "text",
          text: "🌙 ライトをオフにしました",
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

const transport = new StdioServerTransport();
await server.connect(transport);

console.error("[MCP Server] iot-light-server started");
