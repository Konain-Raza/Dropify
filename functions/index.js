const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage().bucket();

exports.deleteOldFiles = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const currentTime = new Date().getTime();
  const maxAgeThreshold = 30 * 1000; // 30 days in milliseconds

  try {
    const roomsSnapshot = await db.collection('Rooms').get();

    roomsSnapshot.forEach(async (roomDoc) => {
      const files = roomDoc.data().files || [];

      const updatedFiles = files.filter(async (file) => {
        const createdAt = file.createdAt.toDate().getTime();
        const fileAgeInMs = currentTime - createdAt;

        if (fileAgeInMs > maxAgeThreshold) {
          // Delete file from Storage
          const fileRef = storage.file(file.storagePath);
          await fileRef.delete();

          return false; // Remove from the filtered array
        }
        return true; // Keep in the filtered array
      });

      // Update Firestore with filtered files
      await db.collection('Rooms').doc(roomDoc.id).update({ files: updatedFiles });
    });

    return null;
  } catch (error) {
    console.error('Error deleting old files:', error);
    throw new Error('Failed to delete old files');
  }
});
