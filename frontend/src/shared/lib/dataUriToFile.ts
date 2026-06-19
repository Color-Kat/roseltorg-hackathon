export function dataUriToFile(dataUri: string, baseName = 'file') {
    const [mimePart, dataPart] = dataUri.split(',');
    const mimeString = mimePart.match(/:(.*?);/)?.[1];
    const byteString = atob(dataPart);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mimeString });

    // Определяем расширение на основе mime-типа
    const extension = mimeString?.split('/')[1]; // Например, 'jpeg' или 'png'
    const fileName = `${baseName}.${extension}`; // Например, 'scan.jpg'

    return new File([blob], fileName, { type: mimeString });
}