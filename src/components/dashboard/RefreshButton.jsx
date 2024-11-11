import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function RefreshButton({ onClick, loading }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={loading}
      className={loading ? 'animate-spin' : ''}
    >
      <RefreshCw className="h-4 w-4" />
    </Button>
  );
}
