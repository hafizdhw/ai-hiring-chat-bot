"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card h-[700px] flex flex-col">
            <div className="card-header">
              <div className="flex items-center space-x-3 mb-4">
                <div className="glass-effect rounded-full p-2">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    AI Hiring Assistant
                  </h2>
                  <p className="text-gray-600">
                    Your intelligent partner for candidate evaluation
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  💡 Try these example questions:
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div className="text-blue-700">
                    • "Find candidates with Python experience"
                  </div>
                  <div className="text-blue-700">
                    • "Who interviewed candidates last week?"
                  </div>
                  <div className="text-blue-700">
                    • "Show me senior-level candidates"
                  </div>
                  <div className="text-blue-700">
                    • "Find candidates with AWS experience"
                  </div>
                </div>
              </div>
            </div>

            <div className="card-content flex-1 flex flex-col overflow-auto">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="glass-effect rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <Bot className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Welcome to AI Hiring Assistant!
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      I'm here to help you evaluate candidates. Ask me anything
                      about your candidate data and I'll provide intelligent
                      insights.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 text-blue-600" />
                        )}
                        <span
                          className={`text-xs ${
                            message.role === "user"
                              ? "opacity-70"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-gray-500">
                          AI is thinking...
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="flex space-x-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your candidates..."
                  disabled={isLoading}
                  className="input flex-1"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="btn-primary px-6"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
