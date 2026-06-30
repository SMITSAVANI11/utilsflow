import ImageConverter from "./ImageConverter";

function ImageToPNG() {
  return (
    <ImageConverter
      toolId="image-to-png"
      title="Image to PNG Converter"
      description="Convert JPG, WebP, GIF, BMP, and other image formats to high-quality PNG. 100% free and runs completely in your browser."
      allowedFrom="any"
      defaultTo="png"
    />
  );
}

export default ImageToPNG;
