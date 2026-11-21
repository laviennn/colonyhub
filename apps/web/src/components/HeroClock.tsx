'use client';

import { useEffect, useState } from 'react';

type HeroClockProps = {
  ariaLabel: string;
};

function formatJakartaTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export function HeroClock({ ariaLabel }: HeroClockProps) {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const tick = () => setTime(formatJakartaTime());
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="ticker mono hp-ticker" aria-label={ariaLabel}>
      <span className="ticker-dot" aria-hidden="true" />
      <span>
        JKT <time suppressHydrationWarning>{time}</time> WIB
      </span>
    </p>
  );
}
