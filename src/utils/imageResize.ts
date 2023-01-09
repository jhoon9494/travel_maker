import imageCompression from 'browser-image-compression';

const resizeFn = async (file: File) => {
  const options = {
    maxSizeMB: 1,
  };

  const resizeImg = await imageCompression(file, options);
  const imgFile = new File([resizeImg], file.name);
  return imgFile;
};

export default resizeFn;
