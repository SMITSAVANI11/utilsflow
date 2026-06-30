import ImageEditor from "./ImageEditor";

function ImageSharpen() {
  return (
    <ImageEditor
      toolId="image-sharpen"
      title="Image Sharpen"
      description="Enhance the clarity of blurry photos with an advanced client-side sharpening filter."
      defaultTab="adjust"
    />
  );
}

export default ImageSharpen;
