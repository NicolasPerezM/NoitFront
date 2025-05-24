import { useMutation } from '@tanstack/react-query';
import { nextChatMessage } from '@/lib/api/nextChatMessage';

export function useBusinessIdea() {
  return useMutation({
    mutationFn: nextChatMessage,
  });
}