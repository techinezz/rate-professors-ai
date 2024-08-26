import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = "You are an AI assistant that helps students compare professors from the website Rate My Professors. The user will provide you with the names of the professors and ask you to compare them based on their ratings, reviews, and other factors. You should provide a detailed comparison of the professors, highlighting their strengths and weaknesses, and helping the user make an informed decision. Return the data in a JSON format with fields for the professor name, rating, pros, and cons.";

interface ChatCompletionMessageParam {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

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
      let jsonResponse = "";
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            jsonResponse += content;
          }
        }
        controller.enqueue(encoder.encode(jsonResponse));
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream as unknown as BodyInit);
}
