import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Make Pusher available globally for Laravel Echo
  if (import.meta.client) {
    window.Pusher = Pusher;

    const echo = new Echo({
      broadcaster: 'reverb',
      key: config.public.reverbAppKey,
      wsHost: config.public.reverbHost,
      wsPort: config.public.reverbPort,
      wssPort: config.public.reverbPort,
      forceTLS: config.public.reverbScheme === 'https',
      enabledTransports: ['ws', 'wss'],
    });

    return {
      provide: {
        echo
      }
    };
  }
});
