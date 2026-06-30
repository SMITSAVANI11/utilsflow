import ImageConverter from "./ImageConverter";

function WebPToPNG() {
  return (
    <ImageConverter
      toolId="webp-to-png"
      title="WebP to PNG Converter"
      description="Convert next-gen WebP images to standard lossless PNG format online instantly. Perfect compatibility for older platforms."
      allowedFrom="webp"
      defaultTo="png"
    />
  );
}

export default WebPToPNG;
