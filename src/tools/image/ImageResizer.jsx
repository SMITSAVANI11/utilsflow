import ImageEditor from "./ImageEditor";

function ImageResizer() {
  return (
    <ImageEditor
      toolId="image-resizer"
      title="Image Resizer"
      description="Resize images online to exact pixel width and height, or scale by maintaining original aspect ratios client-side."
      defaultTab="resize"
    />
  );
}

export default ImageResizer;
