// PatchViewer.tsx
import React, { useState } from 'react';
import { parsePatch, type ParsedDiff } from 'diff';

// type LineInfo = {
//   type: 'added' | 'removed' | 'context';
//   value: string;
// };

export function PatchViewer() {
  const [parsed, setParsed] = useState<ParsedDiff[] | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;

    const content = await file.text();
    const parsedPatch = parsePatch(content);
    setParsed(parsedPatch);
  };

  return (
    <div>
      <h2>Safe Patch Viewer (Side-by-Side)</h2>
      <input type="file" accept=".diff,.patch,.txt" onChange={handleFileUpload} />

      {parsed?.map((file, i) => (
        <div key={i} style={{ marginTop: 24 }}>
          <h3>{file.oldFileName} → {file.newFileName}</h3>
          {file.hunks.map((hunk, j) => (
            <div key={j} style={{ display: 'flex', fontFamily: 'monospace', fontSize: '14px' }}>
              <div style={{ flex: 1, padding: 4, backgroundColor: '#f0f0f0' }}>
                {hunk.lines.map((line, idx) =>
                  line.startsWith('-') || line.startsWith(' ') ? (
                    <div key={idx} style={{ backgroundColor: line.startsWith('-') ? '#ffecec' : undefined }}>
                      {line}
                    </div>
                  ) : null
                )}
              </div>
              <div style={{ flex: 1, padding: 4, backgroundColor: '#f0f0f0' }}>
                {hunk.lines.map((line, idx) =>
                  line.startsWith('+') || line.startsWith(' ') ? (
                    <div key={idx} style={{ backgroundColor: line.startsWith('+') ? '#eaffea' : undefined }}>
                      {line}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
