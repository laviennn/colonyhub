'use client';

import { useState } from 'react';
import type { RichTextBlock } from '@colonyhub/content';

function FigureBlock({
  block,
}: {
  block: Extract<RichTextBlock, { type: 'figure' }>;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="rich-figure">
      <div className="rich-figure-frame">
        {failed ? (
          <p className="mono" style={{ padding: 32, color: 'var(--on-dark-2)', fontSize: '0.875rem' }}>
            {block.alt}
          </p>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

export function RichTextRenderer({ blocks }: { blocks: readonly RichTextBlock[] }) {
  return (
    <div className="rich-text">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h2':
            return <h2 key={idx}>{block.text}</h2>;
          case 'h3':
            return <h3 key={idx}>{block.text}</h3>;
          case 'p':
            return <p key={idx}>{block.text}</p>;
          case 'ul':
            return (
              <ul key={idx}>
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote key={idx}>
                <p>{block.text}</p>
                {block.cite ? <cite>{block.cite}</cite> : null}
              </blockquote>
            );
          case 'table':
            return (
              <div key={idx} className="rich-table-wrap">
                <table className="rich-table">
                  <thead>
                    <tr>
                      {block.headers.map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'code':
            return (
              <pre key={idx} data-lang={block.language}>
                <code>{block.code}</code>
              </pre>
            );
          case 'figure':
            return <FigureBlock key={idx} block={block} />;
        }
      })}
    </div>
  );
}
