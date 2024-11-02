import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: NextRequest, res: NextResponse) {
  const { userId } = await auth();
  if (!userId) {
    console.log("Unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { file_key, file_name } = body;
    console.log("File Key:", file_key, "File Name:", file_name);

    await loadS3IntoPinecone(file_key);
    console.log("Loaded into Pinecone");

    const chat_id = await db
        .insert(chats)
        .values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: getS3Url(file_key),
            userId,
        })
        .returning({
            insertedId: chats.id,
        });

    console.log("Chat ID:", chat_id);

    return NextResponse.json(
        {
            chat_id: chat_id[0].insertedId,
        },
        { status: 200 }
    );
} catch (error) {
    console.error("Error in /api/create-chat:", error);
    return NextResponse.json(
        { error: "internal server error" },
        { status: 500 }
    );
}
}
