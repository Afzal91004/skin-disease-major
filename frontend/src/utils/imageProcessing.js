// utils/imageProcessing.js

/**
 * Resize an image file to the specified width and height
 * @param {string} uri - The image URI to resize
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @param {number} quality - Compression quality (0 to 1)
 * @returns {Promise<string>} - Returns Base64 string of resized image
 */
export const resizeImage = async (uri, width, height, quality = 0.8) => {
  const { manipulateAsync } = require("expo-image-manipulator");

  try {
    const result = await manipulateAsync(uri, [{ resize: { width, height } }], {
      compress: quality,
      format: "JPEG",
      base64: true,
    });
    return result.base64;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
};

/**
 * Validate the image file type and size before processing
 * @param {File|Blob} file - The image file to validate
 * @param {number} maxSizeMB - Max allowed size in MB
 * @returns {boolean} - Validation result
 */
export const validateImage = (file, maxSizeMB = 5) => {
  const validTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    alert("Only JPEG and PNG images are allowed.");
    return false;
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    alert(`Image size should be less than ${maxSizeMB} MB.`);
    return false;
  }
  return true;
};

/**
 * Convert a File or Blob to Base64 string
 * @param {File|Blob} file - Image file to convert
 * @returns {Promise<string>} - Base64 string of the image
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1]; // Remove data URL prefix
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Compress the image file and return Base64
 * @param {File} file - The image file to compress and convert
 * @param {number} width - Target width for resize
 * @param {number} height - Target height for resize
 * @param {number} quality - Compression quality (0 to 1)
 * @returns {Promise<string>} - Base64 string of processed image
 */
export const processImage = async (
  file,
  width = 224,
  height = 224,
  quality = 0.7
) => {
  if (!validateImage(file)) {
    throw new Error("Invalid image");
  }
  // Create Object URL for manipulation
  const objectUrl = URL.createObjectURL(file);
  // Resize the image
  const base64Image = await resizeImage(objectUrl, width, height, quality);
  // Revoke object URL
  URL.revokeObjectURL(objectUrl);
  return base64Image;
};
