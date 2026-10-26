import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { LanguageProvider } from './context/LanguageContext';
import { ExpansionProvider } from './context/ExpansionContext';
import { TrackerProvider } from './context/TrackerContext';
import { GameProvider } from './context/GameContext';
import { InitRunesProvider } from './context/initRunesContext';
import { InitEnemiesProvider } from './context/InitEnemiesContext';

import AppWrapper from './AppWrapper'; // 👈 nuevo

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ExpansionProvider>
        <TrackerProvider>
          <InitRunesProvider>
            <GameProvider>
              <InitEnemiesProvider>
                <AppWrapper /> {/* 👈 nuevo componente que controla el inicio */}
              </InitEnemiesProvider>
            </GameProvider>
          </InitRunesProvider>
        </TrackerProvider>
      </ExpansionProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
