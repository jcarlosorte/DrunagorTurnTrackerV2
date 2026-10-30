import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { LanguageProvider } from './context/LanguageContext';
import { ExpansionProvider } from './context/ExpansionContext';
import { RulesProvider } from './context/RulesContext';
import { TrackerProvider } from './context/TrackerContext';
import { GameProvider } from './context/GameContext';
import { InitRunesProvider } from './context/initRunesContext';
import { InitEnemiesProvider } from './context/InitEnemiesContext';

import AppWrapper from './AppWrapper';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ExpansionProvider>
        <RulesProvider>
          <TrackerProvider>
            <InitRunesProvider>
              <GameProvider>
                <InitEnemiesProvider>
                  <AppWrapper />
                </InitEnemiesProvider>
              </GameProvider>
            </InitRunesProvider>
          </TrackerProvider>
        </RulesProvider>
      </ExpansionProvider>
    </LanguageProvider>
  </React.StrictMode>,
);
