import { useMutation } from '@tanstack/react-query';
import { getBusinessIdeas } from '@/lib/api/getBusinessIdeas';

export function useBusinessIdea() {
  return useMutation({
    mutationFn: getBusinessIdeas,
  });
}