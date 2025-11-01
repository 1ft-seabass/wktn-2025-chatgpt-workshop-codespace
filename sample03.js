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

  // 質問内容
  const questionText = `赤`;

  // 実際に ChatGPT にお願いするテキスト
  // テンプレートリテラルのバッククォート「`」を使っているので複数行できる
  const promptText = `
今回は「${questionText}」という色名がRGB値で返答ください。
色名がRGB値で認識されたら rgb_json を使います。
色名がRGB値で認識されない場合は rgb_json_not_found を使います。
`;

  console.log("実際に ChatGPT にお願いするテキスト");
  console.log(promptText);
  
  // Function calling の設定
  const functions = [
    {
        "name": "rgb_json",
        "description": "色名から RGB 値の情報を得られた場合",
        "parameters": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "description": "led という値が固定値を入力されます"
                },
                "result": {
                    "type": "boolean",
                    "description": "色名が RGB値 で認識されたので true は認識が入ります。"
                },
                "r": {
                    "type": "number",
                    "description": "色名から RGB 値の情報を得たときの R 値"
                },
                "g": {
                    "type": "number",
                    "description": "色名から RGB 値の情報を得たときの G 値"
                },
                "b": {
                    "type": "number",
                    "description": "色名から RGB 値の情報を得たときの B 値"
                },
                "message": {
                    "type": "string",
                    "description": "色名がRGB値に認識されたときの追加の説明。"
                }
            },
            "required": [
                "type",
                "result",
                "r",
                "g",
                "b",
                "message"
            ]
        }
    },
    {
        "name": "rgb_json_not_found",
        "description": "色名から RGB 値の情報を得られなかった場合",
        "parameters": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "description": "led という値が固定値を入力されます"
                },
                "result": {
                    "type": "boolean",
                    "description": "色名が RGB値 で認識されなかったので false が入ります。"
                },
                "message": {
                    "type": "string",
                    "description": "色名が RGB 値に認識されなかったときの説明。あるいは、色名がRGB値に認識されなかったときの説明。色名の例外は「色名が認識されない例外処理です」と説明します。"
                }
            },
            "required": [
                "type",
                "result",
                "message"
            ]
        }
    }
];

  // ChatGPT API に実際にアクセス
  // 基本仕様 : https://platform.openai.com/docs/guides/text-generation
  // function calling : https://platform.openai.com/docs/guides/function-calling
  const completion = await openai.chat.completions.create({
    messages: [
      // 質問内容
      { role: "user", content: promptText }
    ],
    // Function calling
    model: "gpt-4o",
    functions:functions,
    function_call: "auto"
  });

  // function calling の結果取得
  if (completion.choices[0].message.function_call) {
    const functionData = JSON.parse(completion.choices[0].message.function_call.arguments);

    console.log("function calling の結果取得");
    console.log(functionData);
  }

}

// 実行
main();