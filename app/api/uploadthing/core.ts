import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

 // Fake auth function
const auth = (req: Request) => ({ id: "fakeId" });
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      try {
        const user = auth(req);
        if (!user) throw new UploadThingError("Unauthorized");
        return { userId: user.id };
      } catch (error) {
        console.error("Middleware Error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try{
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
        return { uploadedBy: metadata.userId };
      }catch(error){
        alert(error)
        console.error("Error in onUploadComplete:", error);
        throw error;
      }
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
