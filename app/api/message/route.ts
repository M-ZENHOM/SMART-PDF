import { OpenAIEmbeddings } from '@langchain/openai';
import { db } from "@/db";
import { sendMessageVaildetor } from "@/lib/SchemaVaildetor";
import { Auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { pc } from '@/lib/pincone';
import { PineconeStore } from '@langchain/pinecone';
import { openai } from '@/lib/openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const POST = async (req: NextRequest) => {

    const body = await req.json();

    const user = await Auth()

    if (!user || !user.id) return new Response("UNAUTHORIZED", {
        status: 401
    })


    const { message, fileId } = sendMessageVaildetor.parse(body);

    const file = await db.file.findFirst({
        where: {
            id: fileId,
            userId: user.id
        }
    })

    if (!file) return new Response("NOT FOUND", {
        status: 404
    })

    await db.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userId: user.id,
            fileId
        },
    })


    // vectorize the message
    const pineconeIndex = pc.Index("smart-pdf")
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY
    })

    const vectorStore = await PineconeStore.fromDocuments([], embeddings, {
        pineconeIndex,
        namespace: fileId
    })

    const results = await vectorStore.similaritySearch(message, 4);

    const prevMessages = await db.message.findMany({
        where: {
            fileId
        },
        orderBy: {
            createdAt: "asc"
        },
        take: 6
    })

    const formattedPrevMessages = prevMessages.map((message) => ({
        role: message.isUserMessage ? "user" as const : "assistant" as const,
        content: message.text
    }))

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        stream: true,
        messages: [
            {
                role: 'system',
                content:
                    'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
            },
            {
                role: 'user',
                content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
              
        \n----------------\n
        
        PREVIOUS CONVERSATION:
        ${formattedPrevMessages.map((message) => {
                    if (message.role === 'user') return `User: ${message.content}\n`
                    return `Assistant: ${message.content}\n`
                })}
        
        \n----------------\n
        
        CONTEXT:
        ${results.map((r) => r.pageContent).join('\n\n')}
        
        USER INPUT: ${message}`,
            },
        ],
        max_tokens: 1000
    })

    const stream = OpenAIStream(response, {
        async onCompletion(completion) {
            await db.message.create({
                data: {
                    text: completion,
                    isUserMessage: false,
                    userId: user.id,
                    fileId
                },
            })
        }
    });
    return new StreamingTextResponse(stream);

}