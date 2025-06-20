import { useEffect } from 'react';
import type { BusinessBriefResponse } from '@/lib/api/businessBrief';

interface UseBusinessBriefRedirectProps {
  data: BusinessBriefResponse | undefined;
  isLoading: boolean;
}

export const useBusinessBriefRedirect = ({ data, isLoading }: UseBusinessBriefRedirectProps) => {
  useEffect(() => {
    if (!isLoading && data && data.current_question_index === 7) {
      console.log('Redirigiendo a business brief page - current_question_index:', data.current_question_index);
      // Redirigir a la nueva página con el session_id como parámetro
      window.location.href = `/businessBrief?sessionId=${data.session_id}`;
    }
  }, [data, isLoading]);
}; 