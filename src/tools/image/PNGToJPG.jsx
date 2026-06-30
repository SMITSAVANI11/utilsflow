import ImageConverter from "./ImageConverter";

function PNGToJPG() {
  return (
    <ImageConverter
      toolId="png-to-jpg"
      title="PNG to JPG Converter"
      description="Convert PNG images to JPG format online instantly. Compress and adjust image quality client-side without uploading to any server."
      allowedFrom="png"
      defaultTo="jpeg"
    />
  );
}

export default PNGToJPG;
