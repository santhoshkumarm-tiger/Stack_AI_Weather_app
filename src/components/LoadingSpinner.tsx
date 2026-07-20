/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Analyzing atmospheric data...",
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 space-y-4"
      id="loading-spinner-container"
    >
      <div className="relative w-12 h-12" id="spinner-relative-wrapper">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-sans font-medium text-zinc-500 animate-pulse" id="spinner-message">
        {message}
      </p>
    </div>
  );
};
