'use client';

import { CallEvent } from "@/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Hook to get the current call id from the path params.
 * 
 * @returns 
 */
const useCallEvent = (): CallEvent | null => {
    const queryParams = useSearchParams();
    
    return useMemo(() => {
        return queryParams?.get('ce') as CallEvent || null;
      }, [queryParams]);
  };
  
  export default useCallEvent;