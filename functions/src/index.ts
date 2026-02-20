import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import sharp from 'sharp';
import path from 'path';
import os from 'os';
import fs from 'fs';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const storage = admin.storage().bucket();

export const onImageUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const contentType = object.contentType;

  // Exit if the file doesn't exist or is not an image.
  if (!filePath || !contentType || !contentType.startsWith('image/')) {
    console.log('Not a processable image.');
    return;
  }

  // Exit if the image is not in the 'property-images' folder.
  if (!filePath.startsWith('property-images/')) {
      console.log('Not a property image, skipping processing.');
      return;
  }

  // Exit if the image has already been processed to prevent loops.
  if (filePath.includes('/processed/')) {
    console.log('Image is already processed.');
    return;
  }

  const fileName = path.basename(filePath);
  const tempFilePath = path.join(os.tmpdir(), fileName);

  try {
    // Download the source file
    await storage.file(filePath).download({ destination: tempFilePath });

    // Download the watermark
    const watermarkPath = path.join(os.tmpdir(), 'watermark.png');
    await storage.file('watermark/watermark.png').download({ destination: watermarkPath });

    // Composite the image with the watermark
    const processedImageBuffer = await sharp(tempFilePath)
      .composite([{
          input: watermarkPath,
          gravity: 'center',
      }])
      .toBuffer();

    // Define the new path for the processed image
    const newFilePath = `property-images/processed/${fileName}`;
    const file = storage.file(newFilePath);

    // Save the processed image
    await file.save(processedImageBuffer, { 
        metadata: { contentType },
        public: true, // Make the file publicly accessible
    });

    // Clean up temporary files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(watermarkPath);

    // Get the property ID from the filename and the public URL
    const propertyId = fileName.split('-')[0];
    const imageUrl = file.publicUrl();

    // Update the corresponding Firestore document
    await admin.firestore().collection('properties').doc(propertyId).update({
      imageUrls: admin.firestore.FieldValue.arrayUnion(imageUrl)
    });

    console.log(`Image processed and URL added to property ${propertyId}`);

  } catch (error) {
    console.error('Error processing image:', error);
    // Clean up temp file on error if it exists
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});
