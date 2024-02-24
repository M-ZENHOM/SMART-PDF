import { z } from "zod";

export const sendMessageVaildetor = z.object({
    message: z.string(),
    fileId: z.string()
})