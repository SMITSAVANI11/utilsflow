import ImageConverter from "./ImageConverter";

function ImageToJPG() {
  return (
    <ImageConverter
      toolId="image-to-jpg"
      title="Image to JPG Converter"
      description="Convert PNG, WebP, GIF, BMP, and other image formats to JPG. Customize image quality and file compression settings client-side."
      allowedFrom="any"
      defaultTo="jpeg"
    />
  );
}

export default ImageToJPG;
