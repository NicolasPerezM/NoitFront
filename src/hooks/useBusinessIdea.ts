import { useMutation } from '@tanstack/react-query';
import { businessIdea } from '@/lib/api/businessIdea';

export function useBusinessIdea() {
  return useMutation({
    mutationFn: businessIdea,
  });
}
