import { NextRequest, NextResponse } from 'next/server';

import { requestIntuitionPinGraph } from '@/lib/intuition/pinning';
import type { IntuitionImageUploadInput } from '@/types/api';

const UPLOAD_IMAGE_MUTATION = `
  mutation UploadImage($image: UploadImageInput!) {
    uploadImage(image: $image) {
      images {
        url
        safe
      }
    }
  }
`;

const UPLOAD_IMAGE_FROM_URL_MUTATION = `
  mutation UploadImageFromUrl($image: UploadImageFromUrlInput!) {
    uploadImageFromUrl(image: $image) {
      images {
        url
        original_url
        safe
      }
    }
  }
`;

function isValidImageInput(image: IntuitionImageUploadInput | undefined): image is IntuitionImageUploadInput {
  return Boolean(image?.contentType?.startsWith('image/') && image.data?.trim() && image.filename?.trim());
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    network?: string;
    image?: IntuitionImageUploadInput;
    imageUrl?: string;
  };

  if (body.network !== 'mainnet' && body.network !== 'testnet') {
    return NextResponse.json({ error: 'Unsupported network.' }, { status: 400 });
  }

  const imageUrl = body.imageUrl?.trim() ?? '';

  if (!isValidImageInput(body.image) && !/^https:\/\//.test(imageUrl)) {
    return NextResponse.json({ error: 'A valid image upload payload or HTTPS image URL is required.' }, { status: 400 });
  }

  let data: {
    uploadImage?: {
      images?: Array<{
        url?: string;
        safe?: boolean;
      }>;
    };
    uploadImageFromUrl?: {
      images?: Array<{
        url?: string;
        original_url?: string;
        safe?: boolean;
      }>;
    };
  };

  try {
    data = isValidImageInput(body.image)
      ? await requestIntuitionPinGraph(UPLOAD_IMAGE_MUTATION, { image: body.image })
      : await requestIntuitionPinGraph(UPLOAD_IMAGE_FROM_URL_MUTATION, { image: { url: imageUrl } });
  } catch (caughtError) {
    const message = caughtError instanceof Error ? caughtError.message : 'Image upload failed.';
    const status =
      message.includes('INTUITION_PIN_API_KEY') || message.includes('API key was rejected') ? 500 : 502;

    console.error('[intuition/upload-image]', {
      mode: isValidImageInput(body.image) ? 'file' : 'url',
      network: body.network,
      imageUrl: imageUrl || undefined,
      error: message,
    });

    return NextResponse.json({ error: message }, { status });
  }

  const uploadedImage = data.uploadImage?.images?.[0] ?? data.uploadImageFromUrl?.images?.[0];

  if (!uploadedImage?.url || (!uploadedImage.url.startsWith('https://') && !uploadedImage.url.startsWith('ipfs://'))) {
    return NextResponse.json({ error: 'Upload response did not include a valid image URL.' }, { status: 502 });
  }

  if (uploadedImage.safe === false) {
    return NextResponse.json({ error: 'Image upload was rejected by safety checks.' }, { status: 400 });
  }

  return NextResponse.json(
    uploadedImage.safe === undefined
      ? { url: uploadedImage.url, originalUrl: 'original_url' in uploadedImage ? uploadedImage.original_url : undefined }
      : {
          url: uploadedImage.url,
          safe: uploadedImage.safe,
          originalUrl: 'original_url' in uploadedImage ? uploadedImage.original_url : undefined,
        },
  );
}
