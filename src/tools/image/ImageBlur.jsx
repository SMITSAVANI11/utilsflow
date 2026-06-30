import ImageEditor from "./ImageEditor";

function ImageBlur() {
  return (
    <ImageEditor
      toolId="image-blur"
      title="Image Blur"
      description="Apply a smooth Gaussian blur effect to your images. Customize blur radius with a live preview."
      defaultTab="adjust"
    />
  );
}

export default ImageBlur;
