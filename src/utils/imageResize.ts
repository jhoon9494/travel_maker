import imageCompression from 'browser-image-compression';

const resizeFn = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1100,
  };

  const resizeImg = await imageCompression(file, options);
  const imgFile = new File([resizeImg], file.name, { type: file.type });
  return imgFile;
};

export default resizeFn;
