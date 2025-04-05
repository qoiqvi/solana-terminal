import { useLogin, usePrivy, Wallet } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';

export const useAuth = (onComplete?: (wallet: Wallet) => void) => {
  const { ready, authenticated, user, logout } = usePrivy();
  const { wallets } = useSolanaWallets();

  const { login } = useLogin({
    onComplete: async ({ user }) => {
      if (user.wallet) {
        onComplete?.(user.wallet);
      }
    },
  });

  return {
    ready,
    authenticated,
    user,
    login,
    logout,
    wallets,
  };
};
