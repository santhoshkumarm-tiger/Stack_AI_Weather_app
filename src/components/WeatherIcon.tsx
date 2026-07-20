/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import * as Lucide from "lucide-react";

interface WeatherIconProps {
  name: string;
  size?: number;
  className?: string;
  id?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  size = 24,
  className = "",
  id = "",
}) => {
  // Fallback to HelpCircle if icon name is unrecognized
  const IconComponent = (Lucide as any)[name] || Lucide.HelpCircle;
  return <IconComponent size={size} className={className} id={id} />;
};
