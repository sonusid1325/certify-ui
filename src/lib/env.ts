export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isLocalhost = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '0.0.0.0';
};

export const isLocalNetwork = (rpcEndpoint?: string) => {
  if (!rpcEndpoint) return false;
  return rpcEndpoint.includes('127.0.0.1') ||
         rpcEndpoint.includes('localhost');
};

export const getNetworkName = (rpcEndpoint?: string) => {
  if (!rpcEndpoint) return 'Unknown';

  if (rpcEndpoint.includes('127.0.0.1') || rpcEndpoint.includes('localhost')) {
    return 'Localnet';
  }

  if (rpcEndpoint.includes('devnet')) {
    return 'Devnet';
  }

  if (rpcEndpoint.includes('testnet')) {
    return 'Testnet';
  }

  if (rpcEndpoint.includes('mainnet')) {
    return 'Mainnet';
  }

  return 'Custom';
};

export const shouldShowDevFeatures = (rpcEndpoint?: string) => {
  return isDevelopment() && isLocalNetwork(rpcEndpoint);
};
