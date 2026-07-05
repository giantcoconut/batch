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

function isValidImageInput(image: IntuitionImageUploadInput | undefined): image is IntuitionImageUploadInput {
  return Boolean(image?.contentType?.startsWith('image/') && image.data?.trim() && image.filename?.trim());
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    network?: string;
    image?: IntuitionImageUploadInput;
  };

  if (body.network !== 'mainnet' && body.network !== 'testnet') {
    return NextResponse.json({ error: 'Unsupported network.' }, { status: 400 });
  }

  if (!isValidImageInput(body.image)) {
    return NextResponse.json({ error: 'A valid image upload payload is required.' }, { status: 400 });
  }

  let data: {
    uploadImage?: {
      images?: Array<{
        url?: string;
        safe?: boolean;
      }>;
    };
  };

  try {
    data = await requestIntuitionPinGraph(UPLOAD_IMAGE_MUTATION, { image: body.image });
  } catch (caughtError) {
    const message = caughtError instanceof Error ? caughtError.message : 'Image upload failed.';
    const status = message.includes('INTUITION_PIN_API_KEY') ? 500 : 502;

    return NextResponse.json({ error: message }, { status });
  }

  const uploadedImage = data.uploadImage?.images?.[0];

  if (!uploadedImage?.url || (!uploadedImage.url.startsWith('https://') && !uploadedImage.url.startsWith('ipfs://'))) {
    return NextResponse.json({ error: 'Upload response did not include a valid image URL.' }, { status: 502 });
  }

  if (uploadedImage.safe === false) {
    return NextResponse.json({ error: 'Image upload was rejected by safety checks.' }, { status: 400 });
  }

  return NextResponse.json(
    uploadedImage.safe === undefined ? { url: uploadedImage.url } : { url: uploadedImage.url, safe: uploadedImage.safe },
  );
}
