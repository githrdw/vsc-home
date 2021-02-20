import { createContext } from 'react';

import EventBus from './instance';

const EventBusInstance = new EventBus();
window._bus = EventBusInstance;

export default createContext(EventBusInstance);
export { EventBusInstance };
