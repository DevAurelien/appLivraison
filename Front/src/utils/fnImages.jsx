export async function redimensionnerImage(file, zoneCropPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const urlTemporaire = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const contexte = canvas.getContext("2d");

      canvas.width = 512;
      canvas.height = 512;

      contexte.drawImage(
        image,
        zoneCropPixels.x,
        zoneCropPixels.y,
        zoneCropPixels.width,
        zoneCropPixels.height,
        0,
        0,
        512,
        512,
      );

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(urlTemporaire);

          if (!blob) {
            reject(new Error("Impossible de convertir l'image"));
            return;
          }

          const fichierRedimensionne = new File(
            [blob],
            `${file.name.split(".")[0]}.webp`,
            {
              type: "image/webp",
              lastModified: Date.now(),
            },
          );

          resolve(fichierRedimensionne);
        },
        "image/webp",
        0.8,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(urlTemporaire);
      reject(new Error("Impossible de lire l'image"));
    };

    image.src = urlTemporaire;
  });
}
