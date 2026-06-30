import ImageEditor from "./ImageEditor";

function ImageCropper() {
  return (
    <ImageEditor
      toolId="image-cropper"
      title="Image Cropper"
      description="Crop your images online with ease. Use aspect ratio presets (1:1, 16:9, 4:3) or custom boxes, and download client-side."
      defaultTab="crop"
    />
  );
}

export default ImageCropper;
