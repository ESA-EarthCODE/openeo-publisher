'use client';

import {Button, CircularProgress, Step, StepButton, StepLabel, Stepper, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {BackendSelector} from "@/components/BackendSelector";
import {useOpenEOStore} from "../store/openeo";
import {isAuthenticated} from "../lib/openeo/backends";
import {Authenticate} from "@/components/Authenticate";
import {JobTable} from "@/components/JobTable";
import {Publish} from "@/components/Publish";

interface WizardStep {
    label: string;
    description: string;
    component?: JSX.Element;
    skipComponent?: () => Promise<boolean>;
    isValid: () => boolean;
}

export const Wizard = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const {selectedBackend, selectedJobs} = useOpenEOStore();
    const [activeStep, setActiveStep] = useState<number>(+(urlParams.get('step') || (selectedBackend ? 2 : 0)));
    const [prevStepLoading, setPrevStepLoading] = useState<boolean>(false);
    const [nextStepLoading, setNextStepLoading] = useState<boolean>(false);

    const steps: WizardStep[] = [
        {
            label: 'Select Backend',
            description: 'Choose the openEO backend from which you would like to publish your job',
            component: <BackendSelector></BackendSelector>,
            isValid: () => !!selectedBackend,
        },
        {
            label: 'Authenticate',
            description: 'Please select the authentication provider and login to the openEO backend.',
            skipComponent: async () => selectedBackend ? await isAuthenticated(selectedBackend) : false,
            component: selectedBackend ? <Authenticate backend={selectedBackend}></Authenticate> : undefined,
            isValid: () => false
        },
        {
            label: 'Select Jobs',
            description: 'Select one or  more jobs to publish',
            component: selectedBackend ? <JobTable backend={selectedBackend}></JobTable> : undefined,
            isValid: () => selectedJobs.length > 0,
        },
        {
            label: 'Publish Jobs',
            description: 'Publishing your jobs to the EarthCODE Catalogue',
            component: selectedBackend ? <Publish jobs={selectedJobs} backend={selectedBackend}></Publish> : undefined,
            isValid: () => selectedJobs.length > 0,
        },

    ]

    useEffect(() => {
        window.history.replaceState(null, `Wizard - Step ${activeStep}`, `/?step=${activeStep}`)
    }, [activeStep]);

    const skipStep = async (next: boolean): Promise<boolean> => {
        const step = activeStep + (next ? 1 : -1);
        if (!!steps[step].skipComponent) {
            const skip = await steps[step].skipComponent();
            if (skip) {
                return true;
            }
        }
        return false;
    }

    const getStepIncrement = async (next: boolean): Promise<number> => {
        return await skipStep(next) ? 2 : 1;
    }

    const handleNext = async () => {
        setNextStepLoading(true);
        const increment = await getStepIncrement(true);
        setActiveStep((prevActiveStep) => prevActiveStep + increment);
        setNextStepLoading(false);
    };

    const handleBack = async () => {
        setPrevStepLoading(true);
        const increment = await getStepIncrement(false);
        setActiveStep((prevActiveStep) => prevActiveStep - increment);
        setPrevStepLoading(false);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const generateStepper = () => <Stepper nonLinear activeStep={activeStep}>
        {
            steps.map(({label}, idx) => {
                return (
                    <Step key={label}>
                        <StepButton color="inherit" onClick={() => setActiveStep(idx)}>
                            {label}
                        </StepButton>
                    </Step>
                );
            })
        }
    </Stepper>


    const generateButtons = () => activeStep === steps.length ? (
        <>
            <Typography sx={{mt: 2, mb: 1}}>
                All steps completed - you are finished
            </Typography>
            <div className='flex pt-2'>
                <div className='flex-1'></div>
                <Button onClick={handleReset}>Reset</Button>
            </div>
        </>
    ) : (
        <>
            <div className='py-10'>
                <div className='mb-5'>
                    <Typography variant='h6'>{steps[activeStep].label}</Typography>
                    <span className='text-sm'>{steps[activeStep].description || ''}</span>
                </div>
                <div>
                    {steps[activeStep].component || <></>}
                </div>
            </div>
            <div className='flex pt-2'>
                <Button
                    color="inherit"
                    disabled={activeStep === 0 || prevStepLoading}
                    onClick={handleBack}
                    sx={{mr: 1}}
                >
                    {!prevStepLoading ? 'Back' : <CircularProgress size={24}/>}
                </Button>
                <div className='flex-1'/>
                {activeStep < steps.length - 1 &&
                    <Button onClick={handleNext} disabled={nextStepLoading || !steps[activeStep].isValid()}
                            variant='contained' color='primary'>
                        {!nextStepLoading ? 'Next' : <CircularProgress size={24}/>}
                    </Button>
                }
            </div>
        </>
    )

    return <div>
        {generateStepper()}
        {generateButtons()}
    </div>
}