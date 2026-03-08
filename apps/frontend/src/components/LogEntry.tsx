import React, { useState } from 'react';

interface LogEntryProps {
  log: string;
  className?: string;
  timeClassName?: string;
}

const LogEntryComponent: React.FC<LogEntryProps> = ({
  log,
  className = '',
  timeClassName = '',
}) => {
  // Initialize timestamp once on mount. This prevents O(N) re-renders
  // calculating the current time whenever parent states change.
  const [timestamp] = useState(() => new Date().toLocaleTimeString());

  return (
    <div className={className}>
      <span className={timeClassName}>[{timestamp}]</span>
      {log}
    </div>
  );
};

export const LogEntry = React.memo(LogEntryComponent);
