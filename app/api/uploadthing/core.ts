import { db } from "@/db";
import { Auth } from "@/lib/auth";
import { pc } from "@/lib/pincone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";



const f = createUploadthing();


export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
        .middleware(async ({ req }) => {
            const user = await Auth();
            if (!user || !user.id) {
                throw new UploadThingError("Unauthorized")
            }
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {

            const createdFile = await db.file.create({
                data: {
                    key: file.key,
                    name: file.name,
                    userId: metadata.userId,
                    url: `https://uploadthing-prod-sea1.s3.us-west-2.amazonaws.com/${file.key}`,
                    uploadStatus: "PROCESSING"
                }
            })

            try {

                const response = await fetch(`https://uploadthing-prod-sea1.s3.us-west-2.amazonaws.com/${file.key}`)
                const blob = await response.blob()

                const loader = new PDFLoader(blob);

                const pageLevelDocs = await loader.load();

                const pagesAmt = pageLevelDocs.length;

                const pineconeIndex = pc.Index("smart-pdf")

                const embeddings = new OpenAIEmbeddings({
                    openAIApiKey: process.env.OPENAI_API_KEY
                })

                await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
                    pineconeIndex,
                    // textKey: "text",
                    namespace: createdFile.id
                })

                await db.file.update({
                    data: {
                        uploadStatus: "SUCCESS"
                    },
                    where: {
                        id: createdFile.id
                    }
                })
            } catch (error) {

                await db.file.update({
                    data: {
                        uploadStatus: "FAILED"
                    },
                    where: {
                        id: createdFile.id
                    }
                })

            }

        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;