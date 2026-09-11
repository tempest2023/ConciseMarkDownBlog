// Incremental UTF-8 + SSE parser shared with transport tests.
async function consumeChatStream (response, onEvent) {
  if (!response.ok) {
    let message = 'Chat is temporarily unavailable.';
    try { message = (await response.json()).error || message; } catch {}
    throw new Error(message);
  }
  if (!response.headers.get('content-type')?.includes('text/event-stream') || !response.body) throw new Error('Chat is not available on this host.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let done = false;
  try {
    while (!done) {
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        if (!frame.startsWith('data: ')) continue;
        const event = JSON.parse(frame.slice(6));
        if (event.type === 'error') throw new Error(event.message || 'The reply was interrupted.');
        onEvent(event);
        if (event.type === 'done') done = true;
      }
      if (buffer.length > 128000) throw new Error('Reply too large.');
      if (chunk.done) break;
    }
    if (!done) throw new Error('The reply was interrupted. Please try again.');
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
module.exports = { consumeChatStream };
