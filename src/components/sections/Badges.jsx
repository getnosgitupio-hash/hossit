import html from './badges.html?raw';

/* Section: Badges. Markup is the verbatim slice from the original page,
 * injected unchanged. The display:contents wrapper generates no box, so the
 * rendered layout is identical to the original (no extra wrapper element). */
export default function Badges() {
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}
