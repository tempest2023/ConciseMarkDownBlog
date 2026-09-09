import React from 'react';

// Original vector companion: warm apricot hair, a coral ribbon, and a tiny notebook.
// Separate groups let a five-second CSS cycle move the character without raster assets.
export default function AgentCompanion () {
  return <svg className="companion-art" viewBox="0 0 180 166" fill="none" aria-hidden="true">
    <ellipse className="companion-shadow" cx="91" cy="153" rx="53" ry="7" fill="#796047" opacity=".13" />
    <g className="companion-body" stroke="#514231" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 117Q25 141 30 145Q43 153 55 140L128 144Q143 157 155 143Q143 134 139 115" fill="#e7a759" />
      <path d="M66 143Q62 132 73 124H111Q123 133 119 146" fill="#f6eee0" />
      <path d="M128 63Q150 37 153 57L150 70Q168 66 161 85L148 91L161 106Q143 114 132 92" fill="#e77561" />
      <path d="M145 71L153 57M144 82L158 94" stroke="#a84938" />
      <path d="M38 100Q24 46 70 33Q104 18 132 44Q153 64 145 109L136 142Q127 150 121 136L54 138Q45 153 36 143Z" fill="#f2bd76" />
      <path className="companion-tuft" d="M82 34Q91 7 64 13Q85 -5 101 16Q108 29 94 35" fill="#f2bd76" />
      <path d="M48 82Q57 60 89 60Q122 60 136 86L134 112Q129 139 92 142Q53 143 46 115Z" fill="#fff1dc" />
      <path d="M40 89Q41 43 76 40Q114 27 135 65L144 99L127 90L125 69L116 84L102 74L97 59L89 79L77 67L69 83L61 73L46 109Z" fill="#fac985" />
      <path d="M51 65Q75 38 102 44M108 47Q122 53 130 66" stroke="#ffdfaa" strokeWidth="6" />
      <path d="M48 96Q40 127 53 137L42 140Q34 124 40 105M133 96Q143 124 129 140L139 138" fill="#e9ac62" />
      <path d="M68 92L76 90M106 90L114 93" strokeWidth="2" />
      <g className="companion-eyes" fill="#332e2b" stroke="none">
        <ellipse cx="72" cy="106" rx="5" ry="10" /><ellipse cx="110" cy="106" rx="5" ry="10" />
        <ellipse cx="73" cy="102" rx="1.5" ry="3" fill="#fffaf0" /><ellipse cx="111" cy="102" rx="1.5" ry="3" fill="#fffaf0" />
      </g>
      <ellipse cx="59" cy="116" rx="8" ry="4" fill="#f2b0a0" stroke="none" /><ellipse cx="123" cy="116" rx="8" ry="4" fill="#f2b0a0" stroke="none" />
      <path d="M84 119Q92 124 99 118Q98 132 92 132Q86 132 84 119Z" fill="#e78c80" strokeWidth="1.7" />
      <path d="M56 140Q75 136 91 145Q106 136 127 139L128 153Q107 151 92 158Q74 151 55 154Z" fill="#fffbef" />
      <path d="M92 145V157M62 145L80 148M104 147L120 144" stroke="#c7b596" strokeWidth="1.4" />
      <path d="M56 133Q45 130 45 140Q47 150 60 146Q66 143 64 138Q62 134 56 133Z" fill="#fff1dc" />
      <path className="companion-hand" d="M125 134Q135 127 140 136Q144 146 131 148Q124 149 120 143Q119 138 125 134Z" fill="#fff1dc" />
      <path d="M50 140L51 144M55 139L57 145M129 138L132 145M135 137L137 143" strokeWidth="1.2" />
    </g>
    <g className="companion-sparks" stroke="#e8856b" strokeWidth="3" strokeLinecap="round"><path d="M19 80L13 75M18 92L10 91M158 31L161 24M168 40L174 37" /></g>
  </svg>;
}
