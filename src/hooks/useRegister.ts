
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/lib/api/register';

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}
