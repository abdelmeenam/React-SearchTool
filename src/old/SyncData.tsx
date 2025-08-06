import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import axiosInstancePython from "../api/axiosInstancePython";

interface SyncResult {
  message: string;
  itemsPosted: number;
  actualSavedResponse: string;
  targetEndpoint: string;
}

const SyncData: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);

  const listName = "test scripts July v";
  const sharepointLink = "https://calidermatologyinstitute.sharepoint.com/sites/CDIOperations/Lists/test%20scripts%20July%20v/AllItems.aspx?as=json";
  const drugEndpoint = "https://store.medisearchtool.com/drug/AddScripts";
  const steps = [`Add New Scripts at this List`, 'Transforming records', 'Sending to drug API'];

  const getCurrentStep = (pct: number) => {
    if (pct < 30) return steps[0];
    if (pct < 60) return steps[1];
    if (pct < 90) return steps[2];
    return 'Finalizing...';
  };

  const startFakeProgress = () => {
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 5;
        return next >= 90 ? 90 : next;
      });
    }, 500);
  };

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

      const response = await axiosInstancePython.post<SyncResult>(
        "/list/sync",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`
          }
        }
      );

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

  useEffect(() => {
    if (!loading && status === 'idle') {
      setProgress(0);
    }
  }, [loading, status]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-6">
          Sync Data
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Send drug data to your SharePoint list.
        </p>

        <div className="text-sm text-center text-indigo-700 dark:text-indigo-300 mb-6">
          You Can Add New Scripts To This List {" "}:{" "} 
          <strong>{listName}</strong> <br />
          <a
            href={sharepointLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-sm hover:text-indigo-500"
          >
            View SharePoint List ↗
          </a>
        </div>

        <div className="relative mb-6">
          <button
            onClick={handleSync}
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 
              ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
              text-white`}
          >
            {loading ? 'Syncing…' : 'Start Sync'}
          </button>

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

        {status === 'success' && result && (
          <div className="flex flex-col items-center bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
            <CheckCircle className="w-12 h-12 text-green-500 animate-bounce mb-4" />
            <p className="font-medium text-green-800 dark:text-green-200 mb-2">
              ✅ {result.message}
            </p>
            <div className="text-gray-700 dark:text-gray-300 text-sm">
              <p>total saved Scripts: {result.actualSavedResponse}</p>
              <p>To: {result.targetEndpoint}</p>
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
          <span className="font-medium">Note:</span> This process may take up to 1 minute.
        </p>
      </div>
    </div>
  );
};

export default SyncData;
