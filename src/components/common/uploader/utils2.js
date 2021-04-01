
let toArray = (item) => {
  if (Array.isArray(item)) {
    return item;
  }

  return [item];
};

let readFile = (file, resultType) => {
  return new Promise(function (resolve) {
    if (resultType === 'file') {
      resolve();
      return;
    }

    var reader = new FileReader();

    reader.onload = function (event) {
      resolve(event.target.result);
    };

    if (resultType === 'dataUrl') {
      reader.readAsDataURL(file);
    } else if (resultType === 'text') {
      reader.readAsText(file);
    }
  });
}

let isOversize = (files, maxSize) => {
  return toArray(files).some(function (file) {
    return file.size > maxSize;
  });
};

var IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;

let isImageUrl = (url) => {
  return IMAGE_REGEXP.test(url);
}

let isImageFile = (item) => {
  // some special urls cannot be recognized
  // user can add `isImage` flag to mark it as an image url
  if (item.isImage) {
    return true;
  }

  if (item.file && item.file.type) {
    return item.file.type.indexOf('image') === 0;
  }

  if (item.url) {
    return isImageUrl(item.url);
  }

  if (item.content) {
    return item.content.indexOf('data:image') === 0;
  }

  return false;
};
export {
  toArray,
  readFile,
  isOversize,
  isImageUrl,
  isImageFile
}
