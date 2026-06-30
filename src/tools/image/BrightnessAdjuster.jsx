import ImageEditor from "./ImageEditor";

function BrightnessAdjuster() {
  return (
    <ImageEditor
      toolId="brightness-adjuster"
      title="Brightness Adjuster"
      description="Adjust the brightness, contrast, and saturation of your images in real time using client-side filters."
      defaultTab="adjust"
    />
  );
}

export default BrightnessAdjuster;
