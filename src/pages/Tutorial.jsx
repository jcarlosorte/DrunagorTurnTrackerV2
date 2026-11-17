import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import PageTransition from '@/components/PageTransition';
import { useLanguage } from '@/context/LanguageContext';
import { GiCardPlay, GiBookCover, GiSave, GiGearHammer } from 'react-icons/gi';
import tutorialEs from '../../docs/TUTORIAL.md?raw';
import tutorialEn from '../../docs/TUTORIAL.en.md?raw';

const UI = {
  es: {
    eyebrow: 'Manual del jugador',
    title: 'Tutorial completo',
    subtitle: 'Aprende a usar Drunagor Turn Tracker desde cero: configuración, tablero, turnos, menús, guardados y solución de problemas.',
    contents: 'Contenido',
    sections: 'secciones',
    print: 'Imprimir / PDF',
    back: 'Volver al inicio',
    language: 'Idioma',
    diagramError: 'No se pudo renderizar el diagrama.',
  },
  en: {
    eyebrow: 'Player manual',
    title: 'Complete tutorial',
    subtitle: 'Learn Drunagor Turn Tracker from scratch: setup, board, turns, menus, saves and troubleshooting.',
    contents: 'Contents',
    sections: 'sections',
    print: 'Print / PDF',
    back: 'Back to home',
    language: 'Language',
    diagramError: 'The diagram could not be rendered.',
  },
};

const slugify = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

function decorateHtml(html, baseUrl) {
  return html
    .replace(/<h2>(.*?)<\/h2>/g, (match, content) => {
      const text = content.replace(/<[^>]+>/g, '');
      return `<h2 id="${slugify(text)}">${content}</h2>`;
    })
    .replaceAll('](tutorial/assets/', `](${baseUrl}tutorial/assets/`);
}

function prepareMarkdown(markdown) {
  return markdown
    .replace(/^# .*\n/, '')
    .replace(/^> \*\*(English|Español):\*\*.*$/gm, '')
    .trim();
}

export default function Tutorial() {
  const navigate = useNavigate();
  const { language, setLanguage, translations } = useLanguage();
  const t = translations.tutorial || {};
  const isEnglish = language === 'en';
  const ui = UI[isEnglish ? 'en' : 'es'];
  const contentRef = useRef(null);
  const mermaidCounter = useRef(0);
  const baseUrl = import.meta.env.BASE_URL || '/';

  const markdown = isEnglish ? tutorialEn : tutorialEs;
  const prepared = useMemo(() => prepareMarkdown(markdown), [markdown]);

  const headings = useMemo(() => prepared
    .split('\n')
    .filter((line) => /^##\s+/.test(line))
    .map((line) => line.replace(/^##\s+/, '').trim())
    .filter(Boolean)
    .map((title) => ({ title, id: slugify(title) })), [prepared]);

  const html = useMemo(() => decorateHtml(marked.parse(prepared, { gfm: true }), baseUrl), [prepared, baseUrl]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return undefined;
    const blocks = Array.from(container.querySelectorAll('pre > code.language-mermaid'));
    if (blocks.length === 0) return undefined;

    let disposed = false;
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'strict',
          themeVariables: {
            background: '#020617',
            primaryColor: '#064e3b',
            primaryTextColor: '#ecfdf5',
            primaryBorderColor: '#34d399',
            lineColor: '#94a3b8',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          },
        });
        for (const code of blocks) {
          if (disposed || !code.isConnected) continue;
          const source = code.textContent || '';
          const pre = code.closest('pre');
          if (!pre) continue;
          mermaidCounter.current += 1;
          const id = `tutorial-mermaid-${mermaidCounter.current}`;
          try {
            const { svg } = await mermaid.render(id, source);
            if (disposed || !pre.isConnected) continue;
            const wrapper = document.createElement('div');
            wrapper.className = 'tutorial-diagram';
            wrapper.setAttribute('role', 'img');
            wrapper.innerHTML = svg;
            pre.replaceWith(wrapper);
          } catch {
            const fallback = document.createElement('div');
            fallback.className = 'tutorial-diagram tutorial-diagram--error';
            fallback.textContent = ui.diagramError;
            pre.replaceWith(fallback);
          }
        }
      } catch {
        // If Mermaid cannot load, the rest of the tutorial remains readable.
      }
    })();

    return () => { disposed = true; };
  }, [html, ui.diagramError]);

  return (
    <PageTransition>
      <main className="mx-auto min-h-[calc(100dvh-3.5rem)] max-w-7xl space-y-4 bg-slate-950 px-4 py-6 text-white sm:px-6">
        <style>{`
          .tutorial-prose { color: #cbd5e1; font-size: 0.9rem; line-height: 1.75; }
          .tutorial-prose h2 { margin: 2rem 0 0.75rem; scroll-margin-top: 5rem; border-bottom: 1px solid #334155; padding-bottom: 0.35rem; color: #f8fafc; font-size: 1.3rem; font-weight: 800; }
          .tutorial-prose h3 { margin: 1.4rem 0 0.5rem; color: #e2e8f0; font-size: 1rem; font-weight: 700; }
          .tutorial-prose p { margin: 0.65rem 0; }
          .tutorial-prose ul, .tutorial-prose ol { margin: 0.65rem 0; padding-left: 1.35rem; }
          .tutorial-prose ul { list-style: disc; }
          .tutorial-prose ol { list-style: decimal; }
          .tutorial-prose li { margin: 0.25rem 0; }
          .tutorial-prose strong { color: #f8fafc; font-weight: 700; }
          .tutorial-prose em { color: #e2e8f0; }
          .tutorial-prose a { color: #6ee7b7; text-decoration: underline; text-underline-offset: 2px; }
          .tutorial-prose img { margin: 1rem auto; max-width: 100%; height: auto; border: 1px solid #334155; border-radius: 0.75rem; box-shadow: 0 10px 25px rgb(0 0 0 / 0.3); }
          .tutorial-prose blockquote { margin: 1rem 0; border-left: 3px solid #34d399; border-radius: 0 0.5rem 0.5rem 0; background: #052e2b; padding: 0.75rem 1rem; color: #d1fae5; }
          .tutorial-prose blockquote p { margin: 0.25rem 0; }
          .tutorial-prose hr { margin: 2rem 0; border-color: #334155; }
          .tutorial-prose table { margin: 1rem 0; width: 100%; border-collapse: collapse; font-size: 0.8rem; }
          .tutorial-prose th { background: #1e293b; padding: 0.5rem; text-align: left; color: #f8fafc; font-weight: 700; }
          .tutorial-prose td { border-top: 1px solid #334155; padding: 0.5rem; vertical-align: top; }
          .tutorial-prose tr:nth-child(even) td { background: rgb(15 23 42 / 0.55); }
          .tutorial-prose code { border-radius: 0.3rem; background: #1e293b; padding: 0.1rem 0.3rem; color: #fbbf24; font-size: 0.82em; }
          .tutorial-prose pre { overflow-x: auto; border-radius: 0.75rem; background: #020617; padding: 1rem; }
          .tutorial-prose pre code { background: transparent; padding: 0; color: #e2e8f0; }
          .tutorial-prose .tutorial-diagram { margin: 1rem 0; overflow-x: auto; border: 1px solid #334155; border-radius: 0.75rem; background: #020617; padding: 0.75rem; }
          .tutorial-prose .tutorial-diagram svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }
          .tutorial-prose .tutorial-diagram--error { color: #fca5a5; font-size: 0.8rem; text-align: center; }
          @media print {
            .tutorial-no-print { display: none !important; }
            .tutorial-prose { color: #111; font-size: 10pt; }
            .tutorial-prose h2 { color: #111; break-after: avoid; }
            .tutorial-prose h3 { color: #222; }
            .tutorial-prose strong { color: #111; }
            .tutorial-prose img { break-inside: avoid; }
            .tutorial-prose table { font-size: 8pt; }
          }
        `}</style>

        <header className="overflow-hidden rounded-3xl border border-emerald-800/60 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 p-5 shadow-xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.25em] text-emerald-300">
                <GiBookCover aria-hidden="true" /> {ui.eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{ui.title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{ui.subtitle}</p>
            </div>
            <div className="tutorial-no-print flex flex-wrap items-center gap-2">
              <div className="flex rounded-xl border border-slate-600 bg-slate-900 p-0.5" role="group" aria-label={ui.language}>
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  aria-pressed={!isEnglish}
                  className={`min-h-9 rounded-lg px-3 text-xs font-bold ${!isEnglish ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  aria-pressed={isEnglish}
                  className={`min-h-9 rounded-lg px-3 text-xs font-bold ${isEnglish ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  EN
                </button>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-9 rounded-xl border border-slate-600 bg-slate-800 px-3 text-xs font-bold text-slate-100 hover:bg-slate-700"
              >
                {ui.print}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[0.65rem] font-semibold text-emerald-100">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-700/60 bg-emerald-950/50 px-2 py-1"><GiCardPlay /> {headings.length} {ui.sections}</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/70 px-2 py-1"><GiSave /> Local-first</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-600 bg-slate-900/70 px-2 py-1"><GiGearHammer /> Drunagor</span>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="tutorial-no-print lg:sticky lg:top-20 lg:self-start">
            <nav aria-label={ui.contents} className="flex gap-1.5 overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/80 p-2 lg:max-h-[calc(100dvh-6rem)] lg:flex-col lg:overflow-y-auto">
              <p className="hidden px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-slate-400 lg:block">{ui.contents}</p>
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="shrink-0 rounded-lg px-2 py-1.5 text-[0.68rem] font-semibold text-slate-300 hover:bg-slate-800 hover:text-white lg:shrink"
                >
                  {heading.title}
                </a>
              ))}
            </nav>
          </aside>

          <article ref={contentRef} className="tutorial-prose min-w-0 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="lg:col-start-2">
            <button
              type="button"
              onClick={() => navigate('/', { replace: true })}
              className="tutorial-no-print min-h-11 rounded-xl bg-slate-700 px-4 py-2 font-bold text-white transition hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              ← {t.back || ui.back}
            </button>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
