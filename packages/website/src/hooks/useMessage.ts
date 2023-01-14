import logger from '@/utils/logger';
import { usePersistFn, useEventListener } from '../hooks';

export default function useMessage(filter: (e: MessageEvent) => boolean, cb: (e: MessageEvent['data']) => void) {
    const _cb = usePersistFn(cb);

    useEventListener(window,'message', (e) => {
        if (filter(e as MessageEvent)) {
            logger.log(`[use message] receive message`, e);
            _cb(e as MessageEvent);
        }
    });
}
