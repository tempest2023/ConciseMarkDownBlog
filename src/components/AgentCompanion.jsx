import React, { useEffect, useState } from 'react';

const avatarStates = ['idle', 'blink', 'curious', 'focused'];
const avatarSequence = [
  { state: 'idle', duration: 4200 },
  { state: 'blink', duration: 220 },
  { state: 'curious', duration: 2200 },
  { state: 'idle', duration: 3600 },
  { state: 'focused', duration: 1800 },
  { state: 'blink', duration: 220 }
];

export default function AgentCompanion () {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const currentState = avatarSequence[sequenceIndex].state;

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      setSequenceIndex(index => (index + 1) % avatarSequence.length);
    }, avatarSequence[sequenceIndex].duration);
    return () => window.clearTimeout(timer);
  }, [sequenceIndex]);

  return <span className="companion-avatar" data-state={currentState} aria-hidden="true">
    {avatarStates.map(state => <img
      key={state}
      className={`companion-avatar-image${state === currentState ? ' is-current' : ''}`}
      data-avatar-state={state}
      src={`/assets/agent-avatar/${state}.png`}
      alt=""
      width="256"
      height="256"
      draggable="false"
    />)}
  </span>;
}
