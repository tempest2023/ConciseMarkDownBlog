// Local UI QA only. No external model calls, no production configuration flags.
import { streamText } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';
import agent from '../server/personal-agent.cjs';
import preview from '../scripts/preview.cjs';
const model = new MockLanguageModelV4({ doStream: async ({ prompt, abortSignal }) => {
  const question = JSON.stringify(prompt.at(-1));
  const error = question.includes('[error]');
  const slow = question.includes('[slow]');
  let cancelled = false;
  return { stream: new ReadableStream({
    async start(controller) {
      abortSignal?.addEventListener('abort', () => { cancelled = true; }, { once: true });
      controller.enqueue({ type: 'stream-start', warnings: [] });
      controller.enqueue({ type: 'text-start', id: 'test' });
      const answer = 'TEST FIXTURE — 这是界面测试回复，不是真实模型回答。\n\nRead the [public work](/work/) and [an untrusted link](https://untrusted.example/track).';
      for (const text of answer.match(/.{1,12}|\n/gs)) {
        if (cancelled) break;
        controller.enqueue({ type: 'text-delta', id: 'test', delta: text });
        await new Promise(resolve => setTimeout(resolve, slow ? 600 : 15));
      }
      if (cancelled) { controller.close(); return; }
      controller.enqueue({ type: 'text-end', id: 'test' });
      controller.enqueue(error ? { type: 'error', error: new Error('Simulated error') } : { type: 'finish', finishReason: { unified: 'stop', raw: 'stop' }, usage: { inputTokens: { total: 0 }, outputTokens: { total: 0 } } });
      controller.close();
    },
    cancel() { cancelled = true; }
  }) };
} });
const handler = agent.createHandler({ env: { PERSONAL_AGENT_ENABLED: 'true', AI_GATEWAY_API_KEY: 'fixture-not-a-key' }, streamText, model, limiter: () => true });
preview.createPreviewServer(handler).listen(4174, '127.0.0.1', () => console.log('TEST FIXTURE ONLY: http://127.0.0.1:4174/ask/'));
