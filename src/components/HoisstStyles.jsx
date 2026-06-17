import css from '../styles/hoisst-design.css?raw';

/* Injects the original Hoisst design system verbatim, exactly as the
 * single-file version did, so the page renders pixel-identical. The CSS
 * string is the untouched HOISST_CSS extracted from the original file. */
export default function HoisstStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
