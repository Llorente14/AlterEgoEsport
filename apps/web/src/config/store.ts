import type { StoreMode } from '@alterego/shared';

/**
 * Store mode for this build. "marketplace" (MVP) sends buyers to Shopee/Tokopedia;
 * "native" enables the cart and checkout once Fase 6 ships. Set PUBLIC_STORE_MODE to override.
 */
export const STORE_MODE: StoreMode = import.meta.env.PUBLIC_STORE_MODE === 'native' ? 'native' : 'marketplace';
