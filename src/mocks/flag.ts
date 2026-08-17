/** Флаг активного мок-режима (ставится в bootstrap до рендера). */
let mockModeActive = false;

export const setMockModeActive = (value: boolean): void => {
  mockModeActive = value;
};

export const isMockModeActive = (): boolean => mockModeActive;
