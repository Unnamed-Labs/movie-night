export const Buzzy = () => (
  <svg
    id="buzzy"
    className="h-16 w-16"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 68 64"
  >
    <defs>
      <linearGradient
        id="linear-gradient"
        x1="50%"
        y1="17%"
        x2="50%"
        y2="100%"
      >
        <stop
          offset="0%"
          stopColor="#a78bfa"
        />
        <stop
          offset="100%"
          stopColor="#60a5fa"
        />
      </linearGradient>
    </defs>
    <g className="motion-safe:animate-[characterfade_1000ms_ease_forwards]">
      <circle
        fill="#f8fafc"
        cx="45.76"
        cy="34.55"
        r="9.92"
      />
      <circle
        fill="#f8fafc"
        cx="22.85"
        cy="34.55"
        r="9.92"
      />
      <path
        fill="url(#linear-gradient)"
        d="M8.49,58.86c-.93,1.09-1.83,2.21-2.81,3.24-.45.47-1.05.84-1.65,1.12-1.24.57-2.35.15-2.87-1.11-.32-.79-.52-1.65-.62-2.5-.23-1.87,0-3.72.35-5.56.71-3.66,2.1-7.03,4.36-10,.76-1,1.34-2.01,1.5-3.26.05-.38.21-.74.34-1.21-.57.46-1.05.87-1.55,1.24-.83.61-1.67,1.21-2.53,1.77-.32.21-.7.34-1.08.42-1.04.22-1.78-.55-1.42-1.55.27-.76.66-1.51,1.12-2.18,1.31-1.93,3-3.51,4.77-5.01.57-.48,1.14-.95,1.68-1.5-.3.12-.6.26-.91.36-1.49.53-2.98,1.05-4.47,1.56-.22.08-.47.11-.7.12-.46.03-.9-.06-1.19-.47-.29-.41-.32-.9-.04-1.27.5-.67,1.04-1.35,1.67-1.9,1.64-1.41,3.56-2.4,5.48-3.35.61-.3,1.23-.6,1.83-.97-.16.03-.32.05-.48.08-1.45.29-2.89.6-4.34.86-.31.06-.66.03-.97-.06-.55-.16-.73-.74-.36-1.17.23-.26.53-.49.84-.65,1.49-.78,3.09-1.24,4.72-1.64.13-.03.25-.07.37-.17-.44.06-.88.11-1.33.18-.46.07-.91.14-1.37.21-1,.15-2,.31-3.01.43-.33.04-.69,0-1.02-.08-.79-.22-1.14-1.01-.63-1.64.48-.59,1.09-1.11,1.73-1.51,2.03-1.28,4.28-2.05,6.59-2.59,1.76-.42,3.56-.68,5.35-1.02.16-.03.32-.1.48-.15,0-.05.01-.09.02-.14-.25-.11-.49-.23-.74-.33-1.7-.66-3.49-.91-5.26-1.24-.64-.12-1.28-.28-1.91-.47-.47-.14-.82-.46-.87-.98-.05-.5.22-.92.63-1.1.82-.35,1.66-.66,2.52-.84,1-.2,2.04-.25,3.08-.36-.04-.06-.09-.14-.16-.21-.28-.29-.41-.64-.28-1.03.14-.4.53-.56.9-.55.83.02,1.7,0,2.48.23,1.49.45,2.94,1.06,4.4,1.61.09.03.18.07.27.11l.1-.12c-.18-.14-.36-.29-.53-.44-1.14-.98-2.29-1.96-3.42-2.96-.5-.45-.97-.93-1.41-1.44-.34-.4-.43-.89-.18-1.38.25-.49.72-.59,1.22-.57,1.24.05,2.36.52,3.44,1.05,1.9.93,3.64,2.11,5.17,3.57.33.32.69.61,1.11.87-.18-.53-.37-1.06-.55-1.59-.44-1.25-.9-2.5-1.32-3.75-.12-.35-.18-.73-.21-1.1-.08-1.15.75-1.75,1.75-1.18.58.33,1.09.83,1.54,1.33,1.61,1.77,2.79,3.82,3.78,5.99.03.06.07.12.2.15-.06-1.02-.13-2.04-.17-3.06-.06-1.54-.13-3.07-.12-4.61,0-.64.15-1.31.36-1.92.45-1.26,1.83-1.52,2.77-.56.78.81,1.12,1.86,1.42,2.9.71,2.47.82,4.99.73,7.54,0,.15,0,.29,0,.54.28-.67.51-1.26.77-1.83.83-1.84,2.01-3.42,3.58-4.69.38-.3.82-.55,1.27-.73.89-.34,1.62.17,1.59,1.13-.02.59-.14,1.19-.31,1.75-.47,1.51-.99,3-1.49,4.5-.03.08-.05.16-.11.37.51-.55.92-1.01,1.34-1.45,1.94-2,4.16-3.58,6.82-4.47.44-.15.93-.21,1.4-.22.79,0,1.33.75.97,1.46-.28.54-.71,1.03-1.17,1.44-1.47,1.31-2.99,2.57-4.48,3.85-.06.05-.12.12-.22.23,2.31-.64,4.6-.89,6.92-.79,1.72.07,3.42.25,5.02.96.33.15.67.35.94.59.65.6.52,1.51-.31,1.8-.85.3-1.75.46-2.64.66-1.44.33-2.88.65-4.31.99-.31.07-.59.25-.88.38,0,.05,0,.11,0,.16.29.06.57.13.86.17,3.71.48,7.29,1.4,10.62,3.14.71.37,1.36.85,2,1.34.68.52.93,1.18.7,1.7-.32.72-.99.8-1.63.75-.99-.09-1.98-.27-2.96-.42-.88-.14-1.76-.28-2.66-.34.34.09.68.17,1.01.29,1.27.47,2.54.94,3.8,1.43.22.08.42.23.61.37.27.22.51.49.4.88-.12.43-.46.66-.88.63-.83-.06-1.66-.16-2.48-.31-1.08-.21-2.15-.48-3.24-.66.42.18.84.36,1.25.55,2.27,1.06,4.52,2.18,6.44,3.84.46.4.87.86,1.27,1.32.16.17.27.39.36.61.35.84-.11,1.67-1.01,1.65-.74-.02-1.51-.18-2.22-.42-1.28-.45-2.52-1.01-3.77-1.52-.08-.03-.16-.06-.3-.02.21.21.42.43.63.63,2.03,1.97,3.98,4.01,5.38,6.49.74,1.3,1.45,2.61,1.59,4.14.15,1.51-.81,2.34-2.28,1.96-1.2-.31-2.22-1.02-3.21-1.73-.55-.4-1.07-.83-1.68-1.31.16,1.14.33,2.19.85,3.13.95,1.74,1.93,3.47,2.9,5.2,1.22,2.18,2.27,4.43,2.8,6.89.24,1.1.34,2.21.05,3.32-.38,1.45-1.71,2.23-3.17,1.87-1.22-.3-2.15-1.07-3.07-1.87-.6-.52-.38-2.48-.79-2.83H8.49ZM45.76,44.47c5.19.13,9.69-4.21,9.85-9.46.18-5.9-4.5-10.16-9.43-10.37-5.57-.24-9.97,4.08-10.26,9.33-.31,5.53,3.86,10.52,9.84,10.5ZM22.84,44.46c5.77.02,9.67-4.62,9.86-9.5.22-5.84-4.44-10.26-9.55-10.32-5.56-.06-10.09,4.33-10.14,9.87-.05,5.36,4.1,9.99,9.83,9.95ZM33.34,48.69c-.4,1-1.06,1.47-1.82,1.34-.93-.16-1.26-.7-1.28-2.12-.47-.25-.92-.5-1.38-.74-.36-.19-.73-.29-1.09,0-.37.3-.47.72-.31,1.13.22.56.46,1.15.82,1.62,1.26,1.62,2.97,2.45,5,2.63,2.7.23,5.09-.45,6.94-2.54.46-.52.85-1.08.96-1.79.14-.91-.53-1.46-1.36-1.11-.48.2-.93.45-1.39.68.24,1.18-.07,1.87-.97,2.17-.86.29-1.51-.1-2.1-1.26h-2.02Z"
      />
      <path
        fill="#020617"
        d="M50.18,31.21c1.6,1.96,1.62,5.25-.65,7.36-2.11,1.96-5.56,1.91-7.63-.12-2.12-2.08-2.25-5.6-.33-7.75,2.03-2.26,5.36-2.09,6.74-1.06-1.62.25-2.44,1.11-2.28,2.39.14,1.11,1.17,1.87,2.37,1.75,1.12-.11,1.86-1.15,1.78-2.57Z"
      />
      <path
        fill="#020617"
        d="M27.6,31.55c1.52,2.2.91,5.54-1.28,7.29-2.22,1.78-5.62,1.5-7.55-.61-1.98-2.16-1.92-5.47.06-7.6,2.06-2.22,5.49-1.95,6.7-.99-1.5.39-2.23,1.18-2.1,2.28.13,1.1.99,1.88,2.08,1.88,1.19,0,1.89-.74,2.1-2.26Z"
      />
    </g>
    <circle
      className="stroke-slate-950 stroke-2 motion-safe:animate-[armleftslide_500ms_ease_forwards]"
      cx="11.89"
      cy="57.54"
      r="4.63"
      fill="url(#linear-gradient)"
    />
    <circle
      className="stroke-slate-950 stroke-2 motion-safe:animate-[armrightslide_700ms_ease_forwards]"
      cx="55.94"
      cy="57.67"
      r="4.63"
      fill="url(#linear-gradient)"
    />
  </svg>
);