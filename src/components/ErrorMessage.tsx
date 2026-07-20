/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div
      className="w-full max-w-2xl mx-auto my-8 p-6 bg-rose-950/20 rounded-2xl border border-rose-900/50 shadow-sm"
      id="error-msg-card"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-rose-900/40 border border-rose-800/40 rounded-xl text-rose-400 shrink-0" id="error-icon-wrapper">
          <AlertCircle size={24} id="error-alert-icon" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-sans font-semibold text-rose-200 text-base" id="error-title">
            Unable to retrieve weather data
          </h3>
          <p className="font-sans text-sm text-rose-400/95 leading-relaxed" id="error-body-text">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              id="error-retry-btn"
              className="mt-4 px-4 py-2 bg-rose-900/60 hover:bg-rose-800 hover:text-rose-100 active:scale-95 text-rose-200 border border-rose-800/60 rounded-lg font-sans font-medium text-xs flex items-center gap-1.5 transition-all duration-200"
            >
              <RefreshCw size={14} className="animate-hover-spin" />
              <span>Retry Search</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
