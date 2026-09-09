import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import AgentCompanion from './AgentCompanion';
import '../styles/agent.css';

const PersonalAgent = lazy(() => import('./PersonalAgent'));
export default function AgentDock () {
  const dialog = useRef(null);
  const launcher = useRef(null);
  const previousFocus = useRef(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [open]);
  function show () {
    previousFocus.current = document.activeElement;
    setMounted(true); setOpen(true);
    dialog.current.showModal();
  }
  function close () { setOpen(false); dialog.current.close(); }
  return <>
    <div className={`agent-dock ${paused ? 'motion-paused' : ''}`} hidden={open}>
      <button className="companion-launcher" ref={launcher} onClick={show} aria-label="Open Ask Tempest" aria-haspopup="dialog" aria-expanded={open} aria-controls="agent-dialog">
        <span className="companion-bubble">A little curious?<br /><strong>Let’s talk.</strong></span>
        <AgentCompanion />
        <span className="companion-chat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3H3V6a2 2 0 0 1 2-2Z" /><path d="M7 9h10M7 13h6" /></svg></span>
      </button>
      <button className="companion-motion" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume companion animation' : 'Pause companion animation'} title={paused ? 'Resume animation' : 'Pause animation'}>{paused ? '▷' : 'Ⅱ'}</button>
    </div>
    <dialog ref={dialog} id="agent-dialog" className="agent-dialog" aria-labelledby="agent-dialog-title" onCancel={event => { event.preventDefault(); close(); }} onClose={() => { setOpen(false); (previousFocus.current?.isConnected ? previousFocus.current : launcher.current)?.focus(); }} onClick={event => {
      if (event.target !== dialog.current) return;
      const rect = dialog.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    }}>
      <header className="agent-dialog-header"><div><span className="agent-online-dot" /><h2 id="agent-dialog-title">Ask Tempest</h2><span className="agent-subtitle">a guide, not a ghostwriter</span></div><button type="button" className="agent-close" onClick={close} aria-label="Close conversation" autoFocus><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></header>
      {mounted && <Suspense fallback={<p role="status" className="agent-loading">Opening a little space for conversation…</p>}><PersonalAgent active={open} /></Suspense>}
    </dialog>
  </>;
}
