import { createContext } from 'react';

import EventBus from './instance';

const EventBusInstance = new EventBus();

export default createContext(EventBusInstance);
export { EventBusInstance };
