import { Component } from 'react';

const CHUNK_ERROR = /dynamically imported module|Loading chunk|Importing a module script failed|Failed to fetch/i;

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Se registra solo en consola: no se envía información a ningún servidor.
    console.error('Error no controlado en la interfaz', error, info);
  }

  render() {
    if (this.state.error) {
      const { error, showDetails } = this.state;
      const isChunkError = CHUNK_ERROR.test(String(error?.message || ''));
      const message = isChunkError
        ? 'Hay una versión nueva de la aplicación. Recarga la página para continuar; tus partidas guardadas no se tocan.'
        : 'Se produjo un error inesperado. Tus datos guardados en el navegador no se han borrado.';

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
          <div className="w-full max-w-md rounded-2xl border border-red-500/60 bg-red-950/40 p-6 text-center">
            <h1 className="text-xl font-bold">{this.props.title || 'Algo ha fallado'}</h1>
            <p className="mt-2 text-sm text-red-100">{message}</p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-11 rounded-lg bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                Recargar
              </button>
              <button
                type="button"
                onClick={() => this.setState({ error: null })}
                className="min-h-11 rounded-lg bg-slate-700 px-4 py-2 font-semibold hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                {this.props.retryLabel || 'Reintentar'}
              </button>
              <a
                href={import.meta.env.BASE_URL}
                className="min-h-11 rounded-lg border border-slate-500 px-4 py-2 font-semibold hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                {this.props.homeLabel || 'Volver al inicio'}
              </a>
            </div>

            <button
              type="button"
              onClick={() => this.setState({ showDetails: !showDetails })}
              className="mt-4 text-xs text-red-200 underline hover:text-white"
              aria-expanded={showDetails}
            >
              {showDetails ? 'Ocultar detalles' : 'Ver detalles técnicos'}
            </button>
            {showDetails && (
              <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-black/40 p-2 text-left text-[0.65rem] text-red-100">
                {String(error?.stack || error?.message || error)}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
