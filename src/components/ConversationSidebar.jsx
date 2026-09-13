import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { conversationTitle } from '../util/agent-history';

export default function ConversationSidebar ({ conversations, activeId, open, onToggle, onSelect, onDelete }) {
  const [deleting, setDeleting] = useState(null);
  const toggle = useRef(null);
  const confirm = useRef(null);
  useEffect(() => { setDeleting(null); }, [activeId, open]);
  useEffect(() => { if (deleting) confirm.current?.focus(); }, [deleting]);
  function collapse () { onToggle(); toggle.current?.focus(); }
  return <>
    {open && <button type="button" className="agent-history-scrim" aria-label="Close conversation history" tabIndex={-1} onClick={collapse} />}
    <aside className={`agent-history${open ? ' is-open' : ''}`} aria-label="Conversation history" onKeyDown={event => {
      if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); if (deleting) { setDeleting(null); toggle.current?.focus(); } else collapse(); }
    }}>
      <div className="agent-history-heading">
        <button ref={toggle} type="button" className="agent-history-toggle" aria-label={open ? 'Collapse history' : 'Expand history'} aria-expanded={open} aria-controls="agent-history-list" onClick={onToggle} title={open ? 'Collapse history' : 'Conversation history'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16m4-12h4m-4 4h4" /></svg>
        </button>
        {open && <span>Conversations</span>}
      </div>
      <div id="agent-history-list" className="agent-history-list" hidden={!open}>
        {activeId === null && <p className="agent-history-draft">New conversation <span>Ready when you are</span></p>}
        <ul>{conversations.map(item => {
          const title = conversationTitle(item);
          return <li key={item.id} className={item.id === activeId ? 'is-active' : ''}>
            {deleting === item.id
              ? <div className="agent-history-confirm"><p>Delete “{title}”?</p><div><button ref={confirm} type="button" onClick={() => { onDelete(item.id); setDeleting(null); toggle.current?.focus(); }}>Delete chat</button><button type="button" onClick={() => { setDeleting(null); toggle.current?.focus(); }}>Cancel</button></div></div>
              : <>
              <button type="button" className="agent-history-select" aria-current={item.id === activeId ? 'true' : undefined} aria-label={`Open conversation: ${title}`} onClick={() => onSelect(item.id)} title={title}><span>{title}</span><small>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Saved conversation'}</small></button>
              <button type="button" className="agent-history-delete" aria-label={`Delete conversation: ${title}`} title="Delete conversation" onClick={() => setDeleting(item.id)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7m4-7v7" /></svg></button>
            </>}
          </li>;
        })}</ul>
      </div>
    </aside>
  </>;
}

ConversationSidebar.propTypes = { conversations: PropTypes.array.isRequired, activeId: PropTypes.string, open: PropTypes.bool.isRequired, onToggle: PropTypes.func.isRequired, onSelect: PropTypes.func.isRequired, onDelete: PropTypes.func.isRequired };
