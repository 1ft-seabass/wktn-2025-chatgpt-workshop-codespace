// OpenAI API キー
const OPENAI_API_KEY = "OPENAI_API_KEY";

// openai ライブラリの読み込み
const OpenAI = require("openai");

// OpenAI の API を使うために上記の設定を割り当てて準備
// 以後 openai というオブジェクトで使える
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// async つきで実行
// 外部の API (OpenAPI) とのやり取りが伴うので待つ処理が必要
async function main() {

  // ChatGPT API に実際にアクセス
  // https://platform.openai.com/docs/guides/gpt/chat-completions-api?lang=node.js
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: "こんにちは!ChatGPTさん!" }  // ユーザーから「こんにちは!ChatGPTさん!」の質問
    ],
    model: "gpt-4o", // モデルは gpt-4o を今回使う。
  });

  // 結果表示
  console.log(completion.choices[0].message.content);
}

// 実行
main();