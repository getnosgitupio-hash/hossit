import html from './case-file.html?raw';

/* Section: CaseFile. Markup is the verbatim slice from the original page,
 * injected unchanged. The display:contents wrapper generates no box, so the
 * rendered layout is identical to the original (no extra wrapper element). */
export default function CaseFile() {
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}
