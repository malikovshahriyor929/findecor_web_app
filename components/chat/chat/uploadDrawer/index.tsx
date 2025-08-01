import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
interface props {
  fileOpen: boolean;
  setFileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uploadImg: string;
  setUploadImg: React.Dispatch<React.SetStateAction<string>>;
  loadingImg: boolean;
  handleUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleUploadFinish: () => void;
}
const MediaUploadDrawer = ({
  fileOpen,
  setFileOpen,
  uploadImg,
  setUploadImg,
  loadingImg,
  handleUploadImage,
  handleUploadFinish,
}: props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="">
      <Drawer
        open={fileOpen}
        onOpenChange={(open: boolean) => {
          setFileOpen(open);
          if (!open) {
            setUploadImg("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        }}
      >
        <DrawerContent className="px-4 pb-6 ">
          <DrawerHeader>
            <DrawerTitle className="text-black">Upload media</DrawerTitle>
          </DrawerHeader>

          <div className="grid gap-4 py-2">
            <div className="w-full min-h-[200px] h-full flex items-center justify-center flex-col p-5 gap-3 rounded-lg border-dashed border-3 border-[#9ca3af]">
              {uploadImg ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div>
                    <Image
                      src={uploadImg}
                      alt={uploadImg}
                      width={250}
                      height={250}
                      className="object-cover object-center rounded-lg"
                    />
                    <div
                      className="absolute z-50 top-2 text-black right-2 cursor-pointer"
                      onClick={() => {
                        setUploadImg("");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <X />
                    </div>
                    <div className="absolute top-2 right-2 animate-ping size-6 bg-black/30 rounded-full" />
                  </div>
                  {loadingImg && (
                    <div className="absolute top-0 left-0 flex items-center justify-center size-full">
                      <Loader2 className="size-10 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload size={30} color="#9ca3af" />
                  <div className="flex items-center max-[355px]:flex-col">
                    <p className="text-sm text-gray-600">
                      Drop your files here, or
                    </p>
                    <p className="text-[#EA580B]  hover:text-[#EA580B]/90 font-medium px-2 text-sm rounded-md">
                      click to browse
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 max-w-[300px] text-center">
                    Supported formats: JPG, PNG, HEIC, HEIF, GIF, WEBP, and more
                  </p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleUploadImage}
              className="hidden"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <p>Select single image</p>
              <p>Upload up to 5MB image</p>
            </div>

            {loadingImg && (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            )}
          </div>

          <DrawerFooter>
            <Button
              onClick={() => {
                setFileOpen(false);
                handleUploadFinish();
              }}
              className="!bg-[#EA580B]"
            >
              Upload
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MediaUploadDrawer;
