import { useState, useCallback } from 'react';
import {
  Itinerary,
  OrchestrationStepEvent,
  OrchestrationStepName,
  TravelPreferenceFormValues,
} from '../types/index.js';
import { streamItinerary } from '../services/api.js';

export function useItineraryPlanner() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<OrchestrationStepName | null>(null);
  const [stepEvents, setStepEvents] = useState<OrchestrationStepEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const planTrip = useCallback((form: TravelPreferenceFormValues) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setStepEvents([]);
    setCurrentStep('collect_preferences');

    const abortFn = streamItinerary(form, {
      onStep: (event) => {
        setCurrentStep(event.step);
        setStepEvents((prev) => [...prev, event]);
      },
      onCompleted: (result) => {
        setItinerary(result);
        setCurrentStep('completed');
        setIsLoading(false);
      },
      onError: (err) => {
        setError(err);
        setIsLoading(false);
      },
    });

    return abortFn;
  }, []);

  const reset = useCallback(() => {
    setItinerary(null);
    setIsLoading(false);
    setCurrentStep(null);
    setStepEvents([]);
    setError(null);
  }, []);

  return {
    itinerary,
    isLoading,
    currentStep,
    stepEvents,
    error,
    planTrip,
    reset,
  };
}

