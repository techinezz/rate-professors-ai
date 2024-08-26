import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ChatCompletionMessageParam {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const systemPrompt = `
You are an AI assistant that helps students compare professors based on their ratings, reviews, and other factors typically found on the website Rate My Professors. 
When a user provides the names of professors, you should compare them based on factors such as teaching effectiveness, clarity, helpfulness, and workload as mentioned in their reviews.

Return the response strictly in the following JSON format:
{
  "professors": [
    {
      "name": "Professor Name",
      "pros": ["List of pros"],
      "cons": ["List of cons"]
    },
    ...
  ]
}

Important:
- Do not invent ratings; use hypothetical ratings that reflect typical feedback.
- Ensure the response is a valid JSON and follows the given format exactly.
- Make sure to include more than 3 pros and cons for each professor.
`;

export async function POST(req: Request): Promise<NextResponse> {

  const openai = new OpenAI();
  const data: ChatCompletionMessageParam[] = await req.json(); 

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data],
    model: 'gpt-3.5-turbo', 
    stream: true,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let textResponse = "";
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            textResponse += content;
          }
        }
        controller.enqueue(encoder.encode(textResponse));
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream as unknown as BodyInit);
}
