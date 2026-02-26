import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

async function bootstrap() {
  // Connect to MongoDB first — routes depend on it
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
  });
}

bootstrap();
