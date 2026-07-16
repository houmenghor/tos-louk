import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // Make Pusher available globally for Laravel Echo
  window.Pusher = Pusher;

  const echo = new Echo({
    broadcaster: 'reverb',
    key: config.public.reverbAppKey,
    wsHost: config.public.reverbHost,
    wsPort: config.public.reverbPort ?? 80,
    wssPort: config.public.reverbPort ?? 443,
    forceTLS: (config.public.reverbScheme ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
  });

  return {
    provide: {
      echo: echo
    }
  };
});
