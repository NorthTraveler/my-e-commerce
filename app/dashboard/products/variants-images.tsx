'use client'

import { VariantSchema } from "@/types/variant-schema"
import { useFieldArray, useForm, useFormContext } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import * as z from 'zod'
import { UploadDropzone } from "@/app/api/uploadthing/upload"
import { error } from "console"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
//用于拖拽抓取
import { Reorder } from "framer-motion"
import { useState } from "react"
//图像上传到具体对应的操作


export default function VariantImages(){
    const {getValues,control,setError} = useFormContext<z.infer<typeof VariantSchema>>()
    //传递控制，控制
    const {fields,remove,append,update,move} = useFieldArray({
        control,
        name:'variantImages',
    })

    const [active,setActive] = useState(0)

    return(
        <div>
            <FormField
                control={control}
                name={"variantImages"}
                render={({ field }) => (
                <FormItem>
                    <FormLabel>产品图片</FormLabel>
                    <FormControl>
                       <UploadDropzone 
                            className="ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 
                            hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:bg-primary/75
                            ut-button:ut-readying:bg-secondary"
                       onUploadError={(error) => {
                        alert(error)
                        console.log(error)
                        setError("variantImages",{
                            type:'validate',
                            message:error.message,
                        })
                        return
                       }} 
                       onBeforeUploadBegin = {(files) => {
                        files.map((file) => 
                        append({
                            name:file.name,
                            size:file.size,
                            url:URL.createObjectURL(file)
                        }))
                        return files
                       }}
                       onClientUploadComplete={(files) => {
                        alert("Upload Completed");
                        const images =getValues('variantImages')
                        images.map((field,imgIDX) => {
                            if(field.url.search('blob:') === 0) {
                                const image = files.find((img) => img.name === field.name)
                                    if(image) {
                                        update(imgIDX,{
                                            url:image.url,
                                            name:image.name,
                                            size:image.size,
                                            key:image.key,
                                        })
                                    }}})
                        return
                       }}
                       config={{mode:"auto"}}
                       endpoint ='imageUploader'/>
                    </FormControl>
                    <FormMessage />
                 </FormItem>
                )}/>
            <div className="rounded-md overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>订单</TableHead>
                            <TableHead>名称</TableHead>
                            <TableHead>尺寸</TableHead>
                            <TableHead>图片</TableHead>
                            <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <Reorder.Group 
                    as="tbody" 
                    values={fields} 
                    onReorder={(e) => {
                        const activeElement = fields[active];
                        e.map((item,index) => {
                            if(item === activeElement){
                                move(active,index)
                                setActive(index)
                                return
                            }
                            return
                        }) 
                    }}>
                        {fields.map((field,index) =>{
                            return(
                                <Reorder.Item
                                as='tr'
                                key={field.id}
                                value={field}
                                id={field.id}
                                onDragStart={() => {setActive(index)}}
                                className = {cn(
                                    field.url.search('blob:')=== 0 
                                    ? 'animate-pulse transition-all' 
                                    : "" ,
                                    "text-sm font-bold text-muted-foreground hover:text-primary")}
                                    >
                                    <TableCell>{index}</TableCell>
                                    <TableCell>{field.name}</TableCell>
                                    <TableCell>{(field.size /(1024*1024)).toFixed(2)} MB</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <Image 
                                            src={field.url} 
                                            alt={field.name}
                                            className="rounded-md"
                                            width={72}
                                            height={48}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                        variant={'ghost'}
                                        onClick={(e) => { 
                                         e.preventDefault()
                                         remove(index)
                                    }}
                                        className = "scale-75" >
                                            <Trash className="h-4" />
                                        </Button>
                                    </TableCell>
                                </Reorder.Item>
                            )
                        })}
                    </Reorder.Group>
                </Table>
            </div>
        </div>
    )
}