'use client';

import { useParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Hook to get the current call id from the path params.
 * 
 * @returns 
 */
const useCallId = () => {
  const params = useParams();
  
  const callId = useMemo(() => {
    return params?.callId as string;
  }, [params?.callId]);

  return callId;
};

export default useCallId;