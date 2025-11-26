import { NextResponse } from "next/server";
import { handleChatInteraction } from "@/lib/gemini";

export async function POST(request) {
    try {
        const { history, message } = await request.json();

        if (!history || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const result = await handleChatInteraction(history, null, message);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
