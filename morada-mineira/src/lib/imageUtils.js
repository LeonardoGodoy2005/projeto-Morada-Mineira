// =============================================
// UTILITÁRIOS DE IMAGEM
// =============================================
// Compressão e manipulação de imagens client-side
// =============================================

/**
 * Comprime uma imagem usando Canvas API
 * @param {File|Blob} file - Arquivo de imagem
 * @param {Object} options
 * @param {number} options.maxWidth - Largura máxima (default: 1200)
 * @param {number} options.maxHeight - Altura máxima (default: 1200)
 * @param {number} options.quality - Qualidade JPEG 0-1 (default: 0.7)
 * @returns {Promise<Blob>} Imagem comprimida
 */
export async function compressImage(file, options = {}) {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.7 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calcular dimensões mantendo proporção
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Falha ao comprimir imagem"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Falha ao carregar imagem"));
    };

    img.src = url;
  });
}

/**
 * Converte File/Blob para base64
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Gera thumbnail a partir de uma imagem
 */
export async function generateThumbnail(file, size = 200) {
  return compressImage(file, { maxWidth: size, maxHeight: size, quality: 0.5 });
}

/**
 * Formata tamanho de arquivo
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
