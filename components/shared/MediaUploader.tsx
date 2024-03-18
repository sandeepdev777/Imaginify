"use client";

import { useToast } from "@/components/ui/use-toast"  // toast is shadcn component for showing messages for a particular events
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
}

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type
}: MediaUploaderProps) => {
  const { toast } = useToast()

  const onUploadSuccessHandler = (result: any) => {
    // on successful upload of the image we update the props/attributes with the result
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,  // here ? is not turnary operator, it is optional chaining operator which is used to check if the value is present or not
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url
    }))

    onValueChange(result?.info?.public_id)  // the publicid gets updated 

  // this message will be shown when image is successfully uploaded
    toast({
      title: 'Image uploaded successfully',
      description: '1 credit was deducted from your account',
      duration: 5000,
      className: 'success-toast' 
    })
  }

  const onUploadErrorHandler = () => {
    // this message will be shown when image is not uploaded
    toast({
      title: 'Something went wrong while uploading',
      description: 'Please try again',
      duration: 5000,
      className: 'error-toast' 
    })
  }

  return (
    <CldUploadWidget   // this is a nextjs cloudinary  predefined widget which is used to upload images  ***********
      uploadPreset="jsm_imaginify"  // this has to be same as you mentioned on cloudinary account
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}  // if image successfully uploaded then this function will be called
      onError={onUploadErrorHandler}   // if image is not uploaded then this function will be called
    >
      {({ open }) => (   // open represent the open state of the widget
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">
            Original
          </h3>

          {publicId ? (
            <>
              <div className="cursor-pointer overflow-hidden rounded-[10px]">  {/** this represent  */}
                <CldImage       // this is a nextjs cloudinary  predefined image component which is used to display images according to the attributes provided
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={publicId}
                  alt="image"
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="media-uploader_cldImage"
                />
              </div>
            </>
          ): (
            <div className="media-uploader_cta" onClick={() => open()}>  {/** this reperesent upload box on which we click to open cloudinary widget */}
              <div className="media-uploader_cta-image">
                <Image 
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
                <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default MediaUploader