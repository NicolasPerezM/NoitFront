import { useMutation } from '@tanstack/react-query';
import { businessIdea } from '@/lib/api/postBusinessIdea';

export function useBusinessIdea() {
  return useMutation({
    mutationFn: businessIdea,
  });
}
