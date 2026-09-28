import { useEffect } from 'react';
import { useStore, initStoreRef } from '@/store/layersStore';

const StoreInitializer = ({ children }: { children: React.ReactNode }) => {
  const store = useStore();

  useEffect(() => {
    initStoreRef(store);
  }, [store]);

  return <>{children}</>;
};

export default StoreInitializer;
