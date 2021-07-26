export const rgbStringify = (rgba) => {
    switch (rgba.toString().length) {
        case 1:
            return `00${rgba}`;
        case 2:
            return `0${rgba}`;
        case 3:
            return `${rgba}`;
        default:
            return `255`;
    }
};