"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import BotImage from "@/assets/bot.png";
import Image from "next/image";

type TMessage = {
  id: number;
  text: string;
  sender: "bot" | "user";
};

export default function Home() {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userInput.trim() === "") return;

    const userMessage: TMessage = {
      id: new Date().getTime(),
      sender: "user",
      text: userInput.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMessage: TMessage = {
          id: new Date().getTime(),
          sender: "bot",
          text: data.message,
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: TMessage = {
          id: new Date().getTime(),
          sender: "bot",
          text: data.error || "Something went wrong",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.log("Error from fetching chat api", error);
      const errorMessage: TMessage = {
        id: new Date().getTime(),
        sender: "bot",
        text: "Something went wrong",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-slate-100 flex justify-center items-center">
      <div className="text-center w-full md:w-2/5 h-[75%]">
        <h1 className="text-2xl bg-slate-300 p-10 rounded-md">
          ChatBot Demo 🤖
        </h1>
        <div className="flex flex-col p-5 border-2 border-gray-200 overflow-y-auto h-[80%]">
          {messages?.map((message: TMessage) => {
            return (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } my-3`}
              >
                <>
                  {message.sender === "bot" && (
                    <div className="rounded-full w-[30px] h-[30px] mr-2">
                      <Image src={BotImage} width={30} height={30} alt="bot" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg text-start px-4 py-2 max-w-xl ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {message.text}
                  </div>
                </>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="flex space-x-1">
                <span className="block w-2 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                <span className="block w-2 h-2 bg-gray-300 rounded-full animate-pulse"></span>
                <span className="block w-2 h-2 bg-gray-300 rounded-full animate-pulse"></span>
              </div>
            </div>
          )}
          <div ref={messageRef}></div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="flex p-4 bg-white">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
