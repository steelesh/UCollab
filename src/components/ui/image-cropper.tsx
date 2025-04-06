"use client";

import type { SyntheticEvent } from "react";
import type { Crop, PixelCrop } from "react-image-crop";

import { CropIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";

import { Button } from "~/components/ui/button";

import "react-image-crop/dist/ReactCrop.css";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";

type ImageCropperProps = {
  readonly dialogOpen: boolean;
  readonly setDialogOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
  readonly selectedFile: File | null;
  readonly onFileChangeAction: (file: File | null) => void;
  readonly aspect?: number;
};

export function ImageCropper({
  dialogOpen,
  setDialogOpenAction,
  selectedFile,
  onFileChangeAction,
  aspect = 16 / 9,
}: ImageCropperProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPreviewUrl("");
    }
  }, [selectedFile]);

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );
    }

    return canvas.toDataURL("image/png", 1.0);
  }

  function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(",");
    const mime = arr[0]?.match(/:(.*?);/)?.[1] ?? "image/png";
    const bstr = atob(arr[1] ?? "");
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  }

  async function onCrop() {
    try {
      if (selectedFile && croppedImageUrl) {
        const file = dataURLtoFile(croppedImageUrl, selectedFile.name);
        onFileChangeAction(file);
      }
      setDialogOpenAction(false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }

  if (!selectedFile || !previewUrl) {
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpenAction}>
      <DialogContent className="p-0 gap-0 max-w-3xl">
        <DialogTitle className="sr-only">Crop Image</DialogTitle>
        <div className="p-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={c => onCropComplete(c)}
            aspect={aspect}
            className="w-full"
            minWidth={100}
            minHeight={100}
            ruleOfThirds
          >
            <Image
              ref={imgRef}
              className="w-full max-h-[60vh] object-contain"
              alt="Cropped"
              src={previewUrl}
              onLoad={onImageLoad}
              width={1280}
              height={720}
              unoptimized
            />
          </ReactCrop>
        </div>
        <DialogFooter className="p-6 pt-0 justify-center">
          <DialogClose asChild>
            <Button
              size="sm"
              type="reset"
              className="w-fit"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            className="w-fit"
            onClick={onCrop}
            disabled={!crop || !selectedFile}
          >
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}
