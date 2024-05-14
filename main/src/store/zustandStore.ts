import create from 'zustand';
import {devtools} from 'zustand/middleware';
import {reducer, initialState} from './reducer';

const useStore = create(
  devtools(set => ({
    state: initialState,
    dispatch: action => set(state => ({state: reducer(state.state, action)})),
  })),
);
