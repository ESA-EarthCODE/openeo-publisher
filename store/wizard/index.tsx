'use client';

import {create} from 'zustand';
import {WizardState} from "./types";


export const useWizardStore = create<WizardState>((set, get) => ({
    activeStep: 0,
    setActiveStep: (step: number) => {
        window.history.replaceState(null, `Wizard - Step ${step}`, `/?step=${step}`)
        return set({activeStep: step})
    },
}));
