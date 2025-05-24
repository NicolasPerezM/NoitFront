import { useMutation } from '@tanstack/react-query';
import { chatMessage } from '@/lib/api/chatMessage';

export function useBusinessIdea() {
  return useMutation({
    mutationFn: chatMessage,
  });
}