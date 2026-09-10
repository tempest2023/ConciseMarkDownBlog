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
  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [open]);
  function show () {
    previousFocus.current = document.activeElement;
    setMounted(true);
    setOpen(true);
    if (!dialog.current?.open) dialog.current?.showModal();
  }
  function close () {
    setOpen(false);
    if (dialog.current?.open) dialog.current.close();
  }
  return <>
    <div className="agent-dock" hidden={open}>
      <button className="companion-launcher" ref={launcher} onClick={show} aria-label="Open Ask Tempest" aria-haspopup="dialog" aria-expanded={open} aria-controls="agent-dialog">
        <AgentCompanion />
      </button>
    </div>
    <dialog ref={dialog} id="agent-dialog" className="agent-dialog" aria-labelledby="agent-dialog-title" onCancel={event => { event.preventDefault(); close(); }} onClose={() => { setOpen(false); (previousFocus.current?.isConnected ? previousFocus.current : launcher.current)?.focus(); }} onClick={event => {
      if (event.target !== dialog.current) return;
      const rect = dialog.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    }}>
      <header className="agent-dialog-header"><div><span className="agent-online-dot" /><h2 id="agent-dialog-title">Ask Tempest</h2><span className="agent-subtitle">AI guide to my public work</span></div><button type="button" className="agent-close" onClick={close} aria-label="Close conversation" autoFocus><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></header>
      {mounted && <Suspense fallback={<p role="status" className="agent-loading">Opening a little space for conversation…</p>}><PersonalAgent active={open} /></Suspense>}
    </dialog>
  </>;
}
