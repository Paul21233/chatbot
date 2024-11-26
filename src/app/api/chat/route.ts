/* eslint-disable @typescript-eslint/no-explicit-any */
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({
        status: 400,
        message: "Message is required",
      });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192",
    });

    const resMessage =
      chatCompletion?.choices[0]?.message?.content || "No response";

    return NextResponse.json({
      message: resMessage,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
