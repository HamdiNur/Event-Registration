import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ws = require('ws');

@Injectable()
export class UploadService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      realtime: {
        transport: ws,
      },
    }
  );

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPG, PNG and WebP allowed');
    }

    const ext = file.mimetype.split('/')[1];
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

    const { error } = await this.supabase.storage
      .from('event-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new BadRequestException('Upload failed: ' + error.message);

    const { data } = this.supabase.storage
      .from('event-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}