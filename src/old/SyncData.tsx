import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import axiosInstancePython from "../api/axiosInstancePython";

interface SyncResult {
  message: string;
  recordsFetched: number;
  successCount: number;
  errorCount: number;
  elapsedTime: number;
}

const SyncData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);

  const listName = "Audit Scripts Test List";
  const drugEndpoint =
    "http://localhost:5107/drug/GetAllLatestScriptsPaginatedv2";
  const steps = [
    'Getting data from DB',
    'Filtering new data',
    'Saving new data',
  ];

  // Determine current step based on progress
  const getCurrentStep = (pct: number) => {
    if (pct < 30) return steps[0];
    if (pct < 60) return steps[1];
    if (pct < 90) return steps[2];
    return 'Finalizing...';
  };

  // Start fake loading bar until 90%
  const startFakeProgress = () => {
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 5; // slower increments
        return next >= 90 ? 90 : next;
      });
    }, 500);
  };

  // Stop fake progress
  const stopFakeProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setStatus('idle');
    startTime.current = Date.now();
    startFakeProgress();

    try {
      const payload = {
        list_name: listName,
        drug_endpoint: drugEndpoint
      };
      
      // Use the new /list/sync alias endpoint
      const response = await axiosInstancePython.post<SyncResult>(
        "/list/detailed-sync",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`
          }
        }
      );

      // Enforce minimum duration of 60 seconds
      const elapsed = Date.now() - startTime.current;
      if (elapsed < 60000) {
        await new Promise(resolve => setTimeout(resolve, 60000 - elapsed));
      }

      stopFakeProgress();
      setProgress(100);
      setResult(response.data);
      setStatus('success');
    } catch (err: any) {
      const elapsed = Date.now() - startTime.current;
      if (elapsed < 60000) {
        await new Promise(resolve => setTimeout(resolve, 60000 - elapsed));
      }

      stopFakeProgress();
      setProgress(100);
      setError(
        err.response?.data?.detail || err.message || "Unexpected error."
      );
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Reset progress when restarting
  useEffect(() => {
    if (!loading && status === 'idle') {
      setProgress(0);
    }
  }, [loading, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-6">
          Sync Data (Detailed)
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Sync drug transactions into your SharePoint list. Missing fields will be created automatically.
        </p>

        <div className="relative mb-6">
          <button
            onClick={handleSync}
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 
              ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
              text-white`}
          >
            {loading ? 'Syncing…' : 'Start Detailed Sync'}
          </button>

          {/* Progress Bar */}
          {(loading || status !== 'idle') && (
            <>
              <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
                <div
                  className="h-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-center text-gray-700 dark:text-gray-300 text-sm">
                {getCurrentStep(progress)}
              </p>
            </>
          )}
        </div>

        {/* Result / Error */}
        {status === 'success' && result && (
          <div className="flex flex-col items-center bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
            <CheckCircle className="w-12 h-12 text-green-500 animate-bounce mb-4" />
            <p className="font-medium text-green-800 dark:text-green-200 mb-2">✅ {result.message}</p>
            <div className="text-gray-700 dark:text-gray-300 text-sm">
              <p>Fetched: {result.recordsFetched} records</p>
              <p>Success: {result.successCount>0?result.successCount:"All data is up to date"}</p>
              <p>Skipped: {result.errorCount}</p>
              <p>Time: {result.elapsedTime.toFixed(2)}s</p>
            </div>
          </div>
        )}

        {status === 'error' && error && (
          <div className="flex flex-col items-center bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-6">
            <XCircle className="w-12 h-12 text-red-500 animate-shake mb-4" />
            <p className="font-medium text-red-800 dark:text-red-200">❌ {error}</p>
          </div>
        )}

        <p className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <span className="font-medium">Note:</span> This may take a few minutes depending on record count.
        </p>
      </div>
    </div>
  );
};

export default SyncData;
