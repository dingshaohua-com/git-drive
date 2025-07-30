const getFileType = (name: string) => {
  if (name.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
    return 'image';
  }
  if (name.match(/\.(mp4|mkv|avi|mov|wmv|webm)$/i)) {
    return 'video';
  }
  if (name.match(/\.(mp3|wav|ogg|flac|aac)$/i)) {
    return 'audio';
  }
  if (name.match(/\.(pdf)$/i)) {
    return 'pdf';
  }
  if (name.match(/\.(doc|docx)$/i)) {
    return 'doc';
  }
  if (name.match(/\.(xls|xlsx|csv)$/i)) {
    return 'sheet';
  }
  if (name.match(/\.(ppt|pptx)$/i)) {
    return 'ppt';
  }
  if (name.match(/\.(zip|rar|7z|tar|gz)$/i)) {
    return 'zip';
  }
  if (name.match(/\.(js|ts|jsx|tsx|json|html|css|scss|md|py|java|c|cpp|go|rs|sh)$/i)) {
    return 'code';
  }
  if (name.match(/\.(txt|log)$/i)) {
    return 'text';
  }
  return 'unknown';
};
export default getFileType;
