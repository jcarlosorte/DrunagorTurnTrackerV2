// components/AnimatedEnemyToast.jsx
import { motion } from 'framer-motion';
import { GiBullyMinion, GiHeartBeats, GiFootprint, GiBroadsword } from 'react-icons/gi';

export default function AnimatedEnemyToast({ enemyData, t }) {
 
  const bgClasses = {
    blanco: 'bg-white text-black',
    gris: 'bg-gray-600 text-white',
    negro: 'bg-black text-white',
    jefe: 'bg-red-500 text-white',
    blue: 'bg-blue-700 text-white',
    green: 'bg-green-700 text-white',
    comandante: 'bg-yellow-600 text-black',
    purple: 'bg-purple-500 text-white',
   escenario: 'bg-cyan-600 text-white',
   esbirro: 'bg-cyan-300 text-white',
  };

  const iconColorClasses = {
    blanco: 'text-black',
    gris: 'text-gray-300',
    negro: 'text-white',
    jefe: 'text-red-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    comandante: 'text-yellow-400',
    purple: 'text-purple-400',
   escenario: 'text-cyan-600',
   esbirro: 'text-cyan-300',
  };

  const bgClass = bgClasses[enemyData.color] || 'bg-black text-white';
  const iconClass = iconColorClasses[enemyData.color] || 'text-white';

  const name = enemyData.color === 'escenario'
   ? t?.enemies?.escenario?.[enemyData.id] || enemyData.id
   : t?.enemies?.[enemyData.id] || enemyData.id;
  const life = enemyData.vida ;
  const category = t?.enemies?.categoria[enemyData.categoria] ;
  const com = t?.trackerSelect?.comportamientos[enemyData.comportamiento] ;
  const image = enemyData.imagen ;
  const move = enemyData.movimiento ;
  const attack = enemyData.ataque ;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex flex-col sm:flex-row items-center sm:items-start gap-2 rounded-xl shadow-2xl font-semibold px-2 py-2 text-base ${bgClass}`}
    >
      <img 
         src={image}
         alt={name}
         className="w-24 h-24 sm:w-36 sm:h-36 object-cover rounded-md border border-white shadow-md" loading="lazy" decoding="async" />

     <div className="flex flex-col items-center justify-center gap-2 text-center sm:text-left">
      <GiBullyMinion className={`text-2xl sm:text-3xl ${iconClass}`} />
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <span className="font-bold text-lg font-fantasy">{name}</span>
      </div>
      <div className="text-center text-sm">{category}</div>
      <div className="fst-italic text-center text-xs">— {com} —</div>
      <div className="flex items-center text-center sm:justify-start gap-4 text-sm mt-2">
        <span className="flex items-center gap-1"><GiHeartBeats /> {life}</span>
        <span className="flex items-center gap-1"><GiFootprint /> {move}</span>
        <span className="flex items-center gap-1"><GiBroadsword /> {attack}</span>
      </div>
    </div>
     
    </motion.div>
  );
}
