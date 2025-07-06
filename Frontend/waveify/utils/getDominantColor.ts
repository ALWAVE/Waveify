// // utils.js
// export function getDominantColor(image) {
//     return new Promise((resolve, reject) => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         // Проверяем, загружено ли изображение
//         if (!image.complete) {
//             reject(new Error('Image not loaded'));
//             return;
//         }

//         canvas.width = image.width;
//         canvas.height = image.height;
//         ctx.drawImage(image, 0, 0);

//         const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
//         const colorCounts = {};

//         for (let i = 0; i < data.length; i += 4) {
//             const color = `${data[i]},${data[i + 1]},${data[i + 2]}`;
//             colorCounts[color] = (colorCounts[color] || 0) + 1;
//         }

//         const dominantColor = Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);
//         resolve(dominantColor);
//     });
// }
