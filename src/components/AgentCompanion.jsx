import React from 'react';

// A small, forward-leaning companion drawn as a native SVG.
// The face uses only brows and eyes so the expression stays quiet and simple.
export default function AgentCompanion () {
  return <svg className="companion-art" viewBox="0 0 110 136" fill="none" aria-hidden="true">
    <ellipse className="companion-shadow" cx="59" cy="126" rx="29" ry="5" fill="#6f5742" opacity=".14" />

    <g className="companion-pose" transform="rotate(-11 61 112)" stroke="#443a33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <g className="companion-body">
        <g className="companion-ribbon">
          <path d="M78 35Q93 21 95 39L91 47Q106 44 103 58Q96 65 87 64" fill="#d9665f" />
          <path d="M88 54Q103 61 101 75L85 66Z" fill="#c95150" />
          <path d="M89 46L96 34M89 56L99 66" stroke="#9e3f42" strokeWidth="1.8" />
        </g>

        <path d="M46 62Q34 80 38 102L54 111L83 106Q89 84 76 67Z" fill="#e9a957" />
        <path d="M49 76Q38 88 36 108Q45 117 60 118Q78 117 87 106Q82 86 72 76Z" fill="#f7efe3" />
        <path d="M50 79L58 90L67 78L75 89" fill="#fffaf0" />
        <path d="M56 89L58 116M67 88L70 114" stroke="#cbbba7" strokeWidth="1.6" />

        <path d="M47 83Q34 87 22 99Q18 104 23 108Q28 111 33 105L49 94" fill="#f7dfc5" />
        <path d="M46 82Q36 84 31 91L40 101L52 92Z" fill="#f1b66e" />
        <path d="M24 99L18 96M25 102L19 101" strokeWidth="1.5" />
        <path d="M78 87Q88 96 91 108Q91 114 86 115Q81 115 79 108L72 96" fill="#f7dfc5" />
        <path d="M75 83Q84 89 86 98L75 104L68 91Z" fill="#eead63" />

        <path d="M48 112Q43 120 39 124H55L61 114M69 113Q76 120 84 122L69 126L61 116" fill="#6f594b" />
        <path d="M37 124Q45 121 55 124M69 126Q77 120 85 122" stroke="#f8eee1" strokeWidth="3.2" />

        <path d="M36 40Q38 16 62 12Q84 13 90 35L85 68Q80 81 61 82Q40 80 34 63Z" fill="#e9a654" />
        <path d="M42 40Q45 25 62 22Q78 23 83 38L79 62Q75 73 61 74Q46 72 40 61Z" fill="#fff1dc" />
        <path d="M35 55Q31 71 37 80L45 72L43 55M82 54Q89 70 84 79L76 71" fill="#d89043" />

        <path d="M36 45Q37 19 61 15Q82 16 89 39L84 57L76 43L72 54L61 39L55 52L46 40L39 54Z" fill="#f1b464" />
        <path d="M44 30Q57 17 72 24M76 27Q82 32 84 38" stroke="#ffd99e" strokeWidth="5" />
        <path d="M57 15Q58 4 49 5Q61 -2 68 8Q70 12 66 16" fill="#efb15f" />

        <g className="companion-face">
          <g className="companion-brows" strokeWidth="2.4">
            <path d="M44 50Q49 46 54 48" />
            <path d="M64 47Q71 45 76 49" />
          </g>
          <g className="companion-eyes" fill="#302c2a" stroke="none">
            <ellipse cx="49" cy="58" rx="3.4" ry="7.1" />
            <ellipse cx="69" cy="57" rx="4.1" ry="8" />
            <ellipse cx="50" cy="55" rx="1" ry="2" fill="#fffaf2" />
            <ellipse cx="70" cy="53.5" rx="1.2" ry="2.4" fill="#fffaf2" />
          </g>
        </g>
      </g>
    </g>

    <g className="companion-motion-lines" stroke="#d87862" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 69L13 66M19 78L11 79" />
    </g>
  </svg>;
}
