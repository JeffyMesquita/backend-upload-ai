import { fastifyCors } from '@fastify/cors';
import { fastify } from 'fastify';
import { createTranscriptionRoute } from './routes/create-transcription';
import { generationAiCompletionRoute } from './routes/generation-ai-completion';
import { getAllPromptsRoute } from './routes/get-all-prompts';
import { uploadVideoRoute } from './routes/upload-video';

const app = fastify();

app.register(fastifyCors, {
  // TODO: Change this to the domain of your frontend
  origin: '*',
});

app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generationAiCompletionRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀🚀🚀 HTTP Server is running on port 3333');
  });
