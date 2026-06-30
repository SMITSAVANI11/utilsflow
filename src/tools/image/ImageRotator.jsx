import ImageEditor from "./ImageEditor";

function ImageRotator() {
  return (
    <ImageEditor
      toolId="image-rotator"
      title="Image Rotator"
      description="Rotate your images 90 degrees or flip them horizontally and vertically. Preview and save instantly."
      defaultTab="rotate"
    />
  );
}

export default ImageRotator;
