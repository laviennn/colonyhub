export function HubMarkDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="hub-mark" viewBox="0 0 100 100">
        <g strokeLinecap="round" strokeWidth="6" fill="none" stroke="var(--mk-line)">
          <line x1="80" y1="26" x2="60" y2="18" />
          <line x1="60" y1="18" x2="36" y2="30" />
          <line x1="36" y1="30" x2="20" y2="54" />
          <line x1="20" y1="54" x2="35" y2="78" />
          <line x1="35" y1="78" x2="58" y2="88" />
          <line x1="58" y1="88" x2="80" y2="79" />
        </g>
        <circle cx="60" cy="18" r="9.5" fill="var(--mk-a)" />
        <circle cx="36" cy="30" r="10" fill="var(--mk-b)" />
        <circle cx="20" cy="54" r="14" fill="var(--mk-c)" />
        <circle cx="35" cy="78" r="10" fill="var(--mk-b)" />
        <circle cx="58" cy="88" r="10.5" fill="var(--mk-c)" />
        <circle cx="80" cy="79" r="7.5" fill="var(--mk-a)" />
        <circle cx="80" cy="26" r="7" fill="var(--mk-accent)" />
      </symbol>
    </svg>
  );
}
