import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import config from '@/../amplify_outputs.json';
import { Amplify } from 'aws-amplify';

// Initial configuration to be able to extract the config object
Amplify.configure(config, { ssr: true });
// Extract the initial config object
const existingConfig = Amplify.getConfig();
// Configure amplify again with the extended config object
Amplify.configure(
  {
    ...existingConfig,
    API: {
      ...existingConfig.API,
      REST: config.custom.API,
    },
  },
  { ssr: true }
);
// Extract the final config object to be used in the server runner
const finalConfig = Amplify.getConfig();
export const { runWithAmplifyServerContext } = createServerRunner({
  config: finalConfig,
});
