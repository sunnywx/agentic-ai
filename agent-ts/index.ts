import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText, generateText } from 'ai';
import dotenv from 'dotenv';
import * as readline from 'node:readline/promises';

dotenv.config({path: '../.env'});

const messages: CoreMessage[] = [];

const model_id='gpt-3.5-turbo'

async function main() {
  const { text: answer } = await generateText({
    model: openai(model_id),
    maxSteps: 10,
    system:
      'You are a helpful assistant.',
    prompt:
      'What is openai',
  });

  console.log('completion:', answer)
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