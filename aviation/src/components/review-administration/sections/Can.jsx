import React, { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { ability } from './ability';

// Create the Ability Context
export const AbilityContext = createContext();

// Create the Can component bound to our context
export const Can = createContextualCan(AbilityContext.Consumer);

// AbilityProvider component to wrap your app
export const AbilityProvider = ({ children, ability: userAbility }) => {
  return (
    <AbilityContext.Provider value={userAbility || ability}>
      {children}
    </AbilityContext.Provider>
  );
};