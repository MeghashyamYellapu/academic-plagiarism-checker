import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { PlagiarismResult, PlagiarismMatch } from '../services/api';

export interface AnalysisData {
    id: string;
    filename: string;
    text: string;
    result: PlagiarismResult | null;
    matches: PlagiarismMatch[];
    timestamp: Date;
    status: 'pending' | 'analyzing' | 'completed' | 'error';
    error?: string;
}

interface AnalysisContextType {
    currentAnalysis: AnalysisData | null;
    analysisHistory: AnalysisData[];
    setCurrentAnalysis: (analysis: AnalysisData | null) => void;
    addToHistory: (analysis: AnalysisData) => void;
    clearHistory: () => void;
    getAnalysisById: (id: string) => AnalysisData | undefined;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
    const [analysisHistory, setAnalysisHistory] = useState<AnalysisData[]>([]);

    const addToHistory = (analysis: AnalysisData) => {
        setAnalysisHistory(prev => [analysis, ...prev.slice(0, 49)]); // Keep last 50
    };

    const clearHistory = () => {
        setAnalysisHistory([]);
    };

    const getAnalysisById = (id: string) => {
        if (currentAnalysis?.id === id) return currentAnalysis;
        return analysisHistory.find(a => a.id === id);
    };

    return (
        <AnalysisContext.Provider
            value={{
                currentAnalysis,
                analysisHistory,
                setCurrentAnalysis,
                addToHistory,
                clearHistory,
                getAnalysisById,
            }}
        >
            {children}
        </AnalysisContext.Provider>
    );
};

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
};
