
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/lib/api/auth';

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}
