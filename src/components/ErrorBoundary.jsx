import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
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
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
          <div className="w-full max-w-md rounded-2xl border border-red-500/60 bg-red-950/40 p-6 text-center">
            <h1 className="text-xl font-bold">{this.props.title || 'Algo ha fallado'}</h1>
            <p className="mt-2 text-sm text-red-100">
              {this.props.description || 'Se produjo un error inesperado. Tus datos guardados en el navegador no se han borrado.'}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => this.setState({ error: null })}
                className="min-h-11 rounded-lg bg-slate-700 px-4 py-2 font-semibold hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                {this.props.retryLabel || 'Reintentar'}
              </button>
              <a
                href={import.meta.env.BASE_URL}
                className="min-h-11 rounded-lg bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                {this.props.homeLabel || 'Volver al inicio'}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
