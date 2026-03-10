import { Redirect } from 'expo-router';
import { useWalletStore } from '../src/stores/wallet';

export default function Index() {
  const { connected } = useWalletStore();

  // Gate: if wallet is not connected, show connect screen
  if (!connected) {
    return <Redirect href="/connect" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
