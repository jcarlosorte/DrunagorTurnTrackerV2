// src/context/TrackerContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { readJsonStorage, writeJsonStorage, isPlainObject } from '../utils/storage';

const TrackerContext = createContext();
const defaultTrackerData = {
  heroes: [],
  roles: {},
  enemies: [],
  behaviors: ["estandar", "alternativo", "complejo"],
};

const isStringArray = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
const isTrackerData = (value) => (
  isPlainObject(value) &&
  isStringArray(value.heroes) &&
  isPlainObject(value.roles) &&
  isStringArray(value.enemies) &&
  isStringArray(value.behaviors)
);

export const TrackerProvider = ({ children }) => {
  const [trackerData, setTrackerData] = useState(() => (
    readJsonStorage('trackerData', defaultTrackerData, isTrackerData)
  ));

  useEffect(() => {
    writeJsonStorage('trackerData', trackerData);
  }, [trackerData]);

  return (
    <TrackerContext.Provider value={{ trackerData, setTrackerData }}>
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => useContext(TrackerContext);
