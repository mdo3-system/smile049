import React from 'react';

// Instagram アイコン (SVG)
export function InstagramIcon({ size = 16, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// YouTube アイコン (SVG)
export function YoutubeIcon({ size = 16, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

// note アイコン (SVG: ノート/ペン風)
export function NoteIcon({ size = 16, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

// X (旧Twitter) アイコン (SVG)
export function XIcon({ size = 16, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

// LINE 公式アイコン (SVG)
export function LineIcon({ size = 16, color = '#06C755', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      {...props}
    >
      <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.019 9.589.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.589-3.843 2.589-5.973zm-14.787 2.912h-2.197c-.361 0-.655-.294-.655-.655v-4.514c0-.361.294-.655.655-.655s.655.294.655.655v3.859h1.542c.361 0 .655.294.655.655s-.294.655-.655.655zm2.716-.655c0 .361-.294.655-.655.655s-.655-.294-.655-.655v-4.514c0-.361.294-.655.655-.655s.655.294.655.655v4.514zm4.492.655c-.244 0-.47-.135-.582-.358l-2.091-2.923v2.626c0 .361-.294.655-.655.655s-.655-.294-.655-.655v-4.514c0-.244.135-.47.358-.582.224-.112.492-.093.697.051l2.076 2.902v-2.371c0-.361.294-.655.655-.655s.655.294.655.655v4.514c0 .361-.294.655-.658.655zm3.682-3.214h-1.542v.709h1.542c.361 0 .655.294.655.655s-.294.655-.655.655h-2.197c-.361 0-.655-.294-.655-.655v-4.514c0-.361.294-.655.655-.655h2.197c.361 0 .655.294.655.655s-.294.655-.655.655h-1.542v.685h1.542c.361 0 .655.294.655.655s-.294.655-.655.655z" />
    </svg>
  );
}

