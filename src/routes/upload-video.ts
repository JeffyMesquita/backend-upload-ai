import { fastifyMultipart } from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { prisma } from '../lib/prisma';
import { supabase } from '../lib/supabase';

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25 MB
    },
  });

  app.post('/videos', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({
        error: 'Missing file input.',
      });
    }

    const extension = path.extname(data.filename);

    if (extension !== '.mp3') {
      return reply.status(400).send({
        error: 'Invalid input type, please upload a .mp3 file.',
      });
    }
    const fileBaseName = path.basename(data.filename, extension);

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

    const { error: audioError } = await supabase.storage
      .from('audio')
      .upload(`audio/${fileUploadName}`, data.file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (audioError) {
      return reply.status(500).send({
        error: 'Failed to upload audio file.',
      });
    }

    const { data: dataURL, error: errorURL } = await supabase.storage
      .from('audio')
      .createSignedUrl(
        `audio/${fileUploadName}`,
        // 7 days
        7 * 24 * 60 * 60
      );

    if (errorURL) {
      return reply.status(500).send({
        error: 'Failed to generate URL for audio file.',
      });
    }

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: dataURL?.signedUrl ?? '',
        urlFilename: fileUploadName,
      },
    });

    return reply.status(201).send({
      video,
    });
  });
}
