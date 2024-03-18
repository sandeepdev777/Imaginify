"use client"

// the below is schema copied form shadcn reacthook form documentation
// and modified according to need 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"  //Zod is a library for creating, parsing, and validating JavaScript schemas. it is not a part of shadcn
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CustomField } from "./CustomField"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { useState, useTransition } from "react"
import { updateCredits } from "@/lib/actions/user.actions"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"

 export const formSchema = z.object({  // since it is coming from zod we use z.object
 title: z.string(),   // this is how we define schema for form using zod
 aspectRatio: z.string().optional(),
 color: z.string().optional(),
 prompt: z.string().optional(),  // optional means it is not required
 publicId:z.string(), // this is required
})


const TransformationForm = ({action,data=null,userId,type,creditBalance,config=null}:TransformationFormProps) => {

  const transformationType = transformationTypes[type];
  const [image,setImage]=useState(data)
  const [newTransformation,setNewTransformation]=useState<Transformations | null>(null);
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [isTransforming,setIsTransforming]=useState(false);
  const [transformationConfig,setTransformationConfig]=useState(config);
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // defining initial values for form. for first time it will pull tha data from defaultValues after that it will pull from "data"
  const initialValues = data && action ==='Update' ?{
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  }:defaultValues
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })
 
  // ******* Imp
  // after the image has been uploaded and transformed an js object is provided by the cloudinary
  // which contains the details of the transformed image like publicId, secureURL, width, height etc.
  // this functions grabs those details and sets the image state with those details and directs to the respective page according to the action 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if(data || image) {  // checks whether transformed image is available or not
      const transformationUrl = getCldImageUrl({  // extracts the image details along with the URL of the transformed image
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig
      })
   // this sets the transformed image details to the image state
      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      }
  // now according to the action it will call the api requests and directs to the respective page
      if(action === 'Add') {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: '/'
          })

          if(newImage) {
            form.reset()
            setImage(data)
            router.push(`/transformations/${newImage._id}`)  
          }
        } catch (error) {
          console.log(error);
        }
      }

      if(action === 'Update') {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id
            },
            userId,
            path: `/transformations/${data._id}`
          })

          if(updatedImage) {
            router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    setIsSubmitting(false)
  }

  // after filling the desired input to the generative fill form this func makes the the "apply transformation " button active
  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey]

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }))

    setNewTransformation(transformationType.config);

    return onChangeField(value)
  }

    // after filling the desired input to the object remove or object recolor form this func makes the the "apply transformation " button active
  const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
    debounce(() => {    // this func makes the input to wait for 1 sec before sending the request to the server. this reduces the stress of the server.
      setNewTransformation((prevState: any) => ({
        ...prevState,  // this spread outs the entire state(creating a copy of the state and then modifying it and then setting it back to the state) so that original state should not be modified
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to' ]: value 
        }
      }))
    }, 1000)();
      
    return onChangeField(value)
  }

  // after submitting the input to the form this func merges the new transformation with the existing transformation and then updates the credit balance of the user
  const onTransformHandler = async () => {
    setIsTransforming(true)

    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig)
    )

    setNewTransformation(null)

    startTransition(async () => {
      await updateCredits(userId, creditFee)
    })
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <CustomField 
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

            {type === 'fill' && (  // if we go to generative fill page then only this input field will be visible
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}  
          />
        )}

{(type === 'remove' || type === 'recolor') && (  // if we go to remove or recolor page then only this input field  will be visible
          <div className="prompt-field">
            <CustomField 
              control={form.control}
              name="prompt"
              formLabel={
                type === 'remove' ? 'Object to remove' : 'Object to recolor'
              }
              className="w-full"
              render={({ field }) => (
                <Input 
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                  )}
                />
              )}
            />

            {type === 'recolor' && (  // if we go to recolor page then only this input field is will be visible
              <CustomField 
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input 
                    value={field.value}
                    className="input-field"
                    onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}
                  />
                )}
              />
            )}
          </div>
        )}

{/* wrapping the cloudinary media uploader widget in our form*/}
<div className="media-uploader-field">
          <CustomField 
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader     
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

<TransformedImage 
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
      </div>

<div className="flex flex-col gap-4">
          <Button 
            type="button"
            className="submit-button capitalize"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>
          <Button 
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>
        </div>
    </form>
  </Form>
  )
}


export default TransformationForm