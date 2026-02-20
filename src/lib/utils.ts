export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInDays < 14) return "A week ago";
  const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 2) return "A month ago";

  return "Long ago";
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance; // Distance in kilometers
}

export async function applyWatermark(imageFile: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const watermark = new Image();
    watermark.src = '/watermark.png';

    watermark.onload = () => {
      reader.onload = (readerEvent) => {
        const imageUrl = readerEvent.target?.result as string;
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return reject(new Error('Could not get canvas 2D context'));
          }

          ctx.drawImage(img, 0, 0);

          // Scale watermark to be 20% of the image width
          const watermarkWidth = img.width * 0.2;
          const watermarkHeight = (watermark.height / watermark.width) * watermarkWidth;
          const x = (canvas.width - watermarkWidth) / 2;
          const y = (canvas.height - watermarkHeight) / 2;

          ctx.globalAlpha = 0.5; // Set semi-transparency
          ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
          ctx.globalAlpha = 1.0; // Reset alpha

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          }, 'image/jpeg', 0.9);
        };

        img.onerror = () => {
          reject(new Error('Could not load image.'));
        };

        img.src = imageUrl;
      };

      reader.onerror = () => {
        reject(new Error('Could not read file.'));
      };

      reader.readAsDataURL(imageFile);
    };

    watermark.onerror = () => {
      reject(new Error('Could not load watermark image.'));
    };
  });
}

export function formatPrice(price: number): string {
    if (price >= 1000000000) {
        return (price / 1000000000).toFixed(1) + ' Billion';
    }
    if (price >= 1000000) {
        return (price / 1000000).toFixed(1) + ' Million';
    }
    if (price >= 100000) {
        return (price / 100000).toFixed(1) + ' Lakh';
    }
    return price.toLocaleString();
}