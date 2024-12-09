export const svgToPngDataUrl = (svgElement: SVGSVGElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Serialize SVG
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
  
        // Create image
        const img = new Image();
        img.crossOrigin = 'anonymous';
  
        img.onload = () => {
          try {
            // Setup canvas
            const canvas = document.createElement('canvas');
            const width = svgElement.width.baseVal.value || img.width;
            const height = svgElement.height.baseVal.value || img.height;
            canvas.width = width;
            canvas.height = height;
  
            // Draw image
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Canvas context is not available');
            }
            ctx.drawImage(img, 0, 0);
  
            // Convert to PNG Data URL
            const dataUrl = canvas.toDataURL('image/png');
            URL.revokeObjectURL(url);
            resolve(dataUrl);
          } catch (error) {
            console.error('Canvas drawing error:', error);
            reject(error);
          }
        };
  
        img.onerror = (e) => {
          console.error('Image loading error:', e);
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load SVG into image'));
        };
  
        img.src = url;
      } catch (error) {
        console.error('Error serializing SVG:', error);
        reject(error);
      }
    });
  };
  