// components/AnimatedEnemyToast.jsx
import { motion } from 'framer-motion';
import { GiBullyMinion, GiHeartBeats, GiFootprint, GiBroadsword } from 'react-icons/gi';

const ACCENTS = {
  blanco: { border: 'border-slate-300/70', text: 'text-slate-100' },
  gris: { border: 'border-slate-500/70', text: 'text-slate-200' },
  negro: { border: 'border-slate-700', text: 'text-slate-100' },
  jefe: { border: 'border-red-500/70', text: 'text-red-200' },
  comandante: { border: 'border-yellow-500/70', text: 'text-yellow-200' },
  overlord: { border: 'border-purple-500/70', text: 'text-purple-200' },
  escenario: { border: 'border-cyan-500/70', text: 'text-cyan-200' },
  esbirro: { border: 'border-cyan-400/70', text: 'text-cyan-100' },
};

export default function AnimatedEnemyToast({ enemyData, t }) {
  const accent = ACCENTS[enemyData.color] || ACCENTS.gris;

  const name = enemyData.color === 'escenario'
    ? t?.enemies?.escenario?.[enemyData.id] || enemyData.id
    : t?.enemies?.[enemyData.id] || enemyData.id;
  const life = enemyData.vida;
  const category = t?.enemies?.categoria?.[enemyData.categoria] || enemyData.categoria;
  const com = t?.trackerSelect?.comportamientos?.[enemyData.comportamiento] || enemyData.comportamiento;
  const image = enemyData.imagen;
  const move = enemyData.movimiento;
  const attack = enemyData.ataque;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex w-full max-w-md flex-col gap-3 rounded-2xl border bg-slate-900/95 p-3 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur sm:flex-row sm:items-center ${accent.border}`}
    >
      <img
        src={image}
        alt={name}
        className="h-24 w-24 shrink-0 rounded-xl border border-slate-700 object-cover sm:h-28 sm:w-28"
        loading="lazy"
        decoding="async"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-400">
          <GiBullyMinion className={accent.text} aria-hidden="true" />
          Enemigo
        </div>
        <p className="truncate text-lg font-black text-slate-50">{name}</p>
        <p className="text-xs text-slate-300">{category} · {com}</p>

        <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1">
            <GiHeartBeats className={accent.text} aria-hidden="true" /> {life}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1">
            <GiFootprint className={accent.text} aria-hidden="true" /> {move}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2 py-1">
            <GiBroadsword className={accent.text} aria-hidden="true" /> {attack}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
