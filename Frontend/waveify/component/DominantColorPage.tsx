// // DominantColorPage.tsx
// import React, { useEffect, useRef, useState } from 'react';
// import './global.css';
// import { getDominantColor } from '@/utils/getDominantColor';

// const DominantColorPage: React.FC = () => {
//     const [dominantColor, setDominantColor] = useState<string>('');
//     const imgRef = useRef<HTMLImageElement | null>(null);

//     useEffect(() => {
//         const imgElement = imgRef.current;

//         if (imgElement) {
//             imgElement.onload = () => {
//                 const color = getDominantColor(imgElement);
//                 setDominantColor(`rgb(${color})`);
//             };
//         }
//     }, []);

//     return (
//         <div className="container" style={{ backgroundColor: dominantColor }}>
//             <h1 style={{ color: '#fff' }}>Доминирующий цвет изображения</h1>
//             <img ref={imgRef} src="https://via.placeholder.com/600" alt="Example" />
//             <p style={{ color: '#fff' }}>Цвет: {dominantColor}</p>
//         </div>
//     );
// };

// export default DominantColorPage;
