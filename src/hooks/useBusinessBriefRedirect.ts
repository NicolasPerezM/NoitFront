import { useEffect } from 'react';
import type { BusinessBriefResponse } from '@/lib/api/businessBrief';

interface UseBusinessBriefRedirectProps {
  data: BusinessBriefResponse | undefined;
  isLoading: boolean;
  businessId?: string; // ID del negocio para la redirección
}

export const useBusinessBriefRedirect = ({ data, isLoading, businessId }: UseBusinessBriefRedirectProps) => {
  useEffect(() => {
    if (!isLoading && data && data.current_question_index === 7 && businessId) {
      console.log('Redirigiendo a business idea page - current_question_index:', data.current_question_index);
      // Redirigir a la página dinámica de business idea con el business_id como parámetro y sessionId como query param
      window.location.href = `/businessIdeas/businessIdea/${businessId}?sessionId=${data.session_id}`;
    }
  }, [data, isLoading, businessId]);
}; 