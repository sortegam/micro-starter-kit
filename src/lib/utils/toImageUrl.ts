export const toImageUrl = (processedImagePath: string) =>
  `url('${processedImagePath.replaceAll('\\', '/')}')`;
