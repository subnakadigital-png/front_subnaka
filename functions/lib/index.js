"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onImageUpload = void 0;
const functions = require("firebase-functions");
const firebase_admin_1 = require("firebase-admin");
const sharp_1 = require("sharp");
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("fs");
if (firebase_admin_1.default.apps.length === 0) {
    firebase_admin_1.default.initializeApp();
}
const storage = firebase_admin_1.default.storage().bucket();
exports.onImageUpload = functions.storage.object().onFinalize(async (object) => {
    const fileBucket = object.bucket;
    const filePath = object.name;
    const contentType = object.contentType;
    if (!filePath || !contentType) {
        console.log('No file path or content type.');
        return;
    }
    if (!contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return;
    }
    if (filePath.startsWith('processed/')) {
        console.log('Image is already processed.');
        return;
    }
    const fileName = path_1.default.basename(filePath);
    const tempFilePath = path_1.default.join(os_1.default.tmpdir(), fileName);
    await storage.file(filePath).download({ destination: tempFilePath });
    const watermarkPath = path_1.default.join(os_1.default.tmpdir(), 'watermark.png');
    await storage.file('watermark/watermark.png').download({ destination: watermarkPath });
    const processedImageBuffer = await (0, sharp_1.default)(tempFilePath)
        .composite([{
            input: watermarkPath,
            gravity: 'center',
        }])
        .toBuffer();
    const newFilePath = `processed/${fileName}`;
    const file = storage.file(newFilePath);
    await file.save(processedImageBuffer, {
        metadata: { contentType },
        public: true,
    });
    fs_1.default.unlinkSync(tempFilePath);
    fs_1.default.unlinkSync(watermarkPath);
    const propertyId = fileName.split('-')[0];
    const imageUrl = file.publicUrl();
    await firebase_admin_1.default.firestore().collection('properties').doc(propertyId).update({
        imageUrls: firebase_admin_1.default.firestore.FieldValue.arrayUnion(imageUrl)
    });
    console.log(`Image processed and URL added to property ${propertyId}`);
});
//# sourceMappingURL=index.js.map