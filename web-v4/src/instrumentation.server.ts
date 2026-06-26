import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://2cf59b603adc1e115c0b46fd7a9ff284@o4511229692149760.ingest.us.sentry.io/4511629344702464',

  tracesSampleRate: 1.0,


  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});