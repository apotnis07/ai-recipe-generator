export function request(ctx){
    const { ingredients = [] } = ctx.args;

    const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(",")}.`;

    return {
        resourcePath: `/model/us.anthropic.claude-sonnet-4-6/invoke`,
        method: "POST",
        params: {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages:[
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                            },
                        ],
                    },
                ],
            }),
        },
    };
}


export function response(ctx) {
    if (ctx.error) {
      return {
        error: ctx.error.message,
        body: null,
      };
    }
  
    const parsedBody = JSON.parse(ctx.result.body);
  
    if (!parsedBody.content) {
      return {
        body: null,
        error: JSON.stringify(parsedBody), 
      };
    }
  
    return {
      body: parsedBody.content[0].text,
      error: null,
    };
  }