// Checks if an image url is valid
const checkImage = url => {
    const img = new Image();
    img.src = url;
    return img.onload || img.width > 0;
};

export default checkImage;