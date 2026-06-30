import ImageConverter from "./ImageConverter";

function IconConverter() {
  return (
    <ImageConverter
      toolId="icon-converter"
      title="Icon Converter (ICO)"
      description="Generate standard Windows .ico favicon files from any image format. Bundle multiple resolutions (16px to 256px) into a single file."
      allowedFrom="any"
      defaultTo="ico"
    />
  );
}

export default IconConverter;
