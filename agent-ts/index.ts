import { createOpenAI } from '@ai-sdk/openai';
import OpenAI from 'openai';
import { CoreMessage, streamText, generateText } from 'ai';
import dotenv from 'dotenv';
import * as readline from 'node:readline/promises';
import {HttpsProxyAgent} from 'https-proxy-agent'

dotenv.config({path: '../.env'});

// setup http proxy
let proxy=null
if(process.env.HTTP_PROXY_URL){
  proxy=new HttpsProxyAgent(process.env.HTTP_PROXY_URL)
}

const messages: CoreMessage[] = [];

const model_id='gpt-3.5-turbo'

async function main() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    httpAgent: proxy,
  });

  const messages=[
    {role: 'system', content: 'You are a helpful assistant.'},
    {role: 'user', content: 'what is openai'}
  ]

  // normal mode
  // const completion = await openai.chat.completions.create({
  //   model: model_id,
  //   messages
  // });
  // console.log(completion.choices[0].message)

  // stream mode
  const stream=await openai.chat.completions.create({
    model: model_id,
    messages,
    stream: true
  })
  for await(const chunk of stream){
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
    // console.log(chunk.choices[0]?.delta?.content || "");
  }

  // const { text: answer } = await generateText({
  //   model: openai(model_id),
  //   maxSteps: 10,
  //   system:
  //     'You are a helpful assistant.',
  //   prompt:
  //     'What is openai',
  // });

  // console.log('completion:', answer)
}

async function run_stream() {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const userInput = await terminal.question('You: ');

    messages.push({ role: 'user', content: userInput });

    const result = await streamText({
      model: openai(model_id),
      messages,
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');

    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);