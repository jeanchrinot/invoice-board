import React, { useEffect, useRef, useState } from "react";
import { Bot, Mic, MicOff, Send, User, Zap } from "lucide-react";

interface ChatUIProps {
  isAuthenticated: boolean;
  userName: string;
  onSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  onVoiceRecord: (isRecording: boolean) => void;
  messages: Array<{ id: string; role: "user" | "assistant"; content: string }>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const ChatUI: React.FC<ChatUIProps> = ({
  isAuthenticated = false,
  userName = "Guest",
  onSendMessage,
  onVoiceRecord,
  messages = [],
  input,
  handleInputChange,
  isLoading = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    onVoiceRecord?.(!isRecording);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-200 bg-white p-4 backdrop-blur-sm dark:border-gray-800/50 dark:bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"></div>
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-semibold text-transparent">
                Invoice AI Assistant
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isAuthenticated ? `Welcome back, ${userName}` : "Guest Mode"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                AI Magic
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-100 p-4 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
              Ready to Create Magic?
            </h2>
            <p className="mb-6 max-w-md text-gray-500 dark:text-gray-400">
              I'm your AI invoice wizard! Tell me what you need and watch as I
              conjure up the perfect invoice.
            </p>
            <div className="grid max-w-md grid-cols-1 gap-3 text-sm">
              <div className="cursor-pointer rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:border-purple-500/50 dark:border-gray-700/50 dark:bg-gray-800/50">
                <p className="text-gray-600 dark:text-gray-400">
                  "Create an invoice for web development"
                </p>
              </div>
              <div className="cursor-pointer rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:border-blue-500/50 dark:border-gray-700/50 dark:bg-gray-800/50">
                <p className="text-gray-600 dark:text-gray-400">
                  "Generate invoice for $2,500 consultation"
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-sm lg:max-w-md ${message.role === "user" ? "flex-row-reverse" : "flex-row"} items-start space-x-3`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    message.role === "user"
                      ? "ml-3 bg-gradient-to-r from-green-500 to-blue-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-green-600 to-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-900 dark:border-gray-700/50 dark:bg-gray-800/80 dark:text-gray-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl border border-gray-300 bg-white px-4 py-3 dark:border-gray-700/50 dark:bg-gray-800/80">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 animate-spin text-purple-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Working my magic...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-200 bg-white p-4 backdrop-blur-sm dark:border-gray-800/50 dark:bg-black/20">
        <form onSubmit={onSendMessage}>
          <div className="relative mx-auto max-w-3xl rounded-xl border border-gray-300 bg-gray-50 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50">
            <div className="flex items-end space-x-3 p-3">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask AI assistant anything..."
                className="min-h-[48px] w-full bg-transparent p-3 text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100"
                disabled={isLoading}
              />
              <div className="flex items-center space-x-2 pb-2">
                <button
                  type="button"
                  onClick={handleVoiceRecord}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                    isRecording
                      ? "bg-red-500 shadow-lg shadow-red-500/20 hover:bg-red-600"
                      : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                  disabled={isLoading}
                >
                  {isRecording ? (
                    <MicOff className="h-5 w-5 text-white" />
                  ) : (
                    <Mic className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                    input.trim() && !isLoading
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-purple-500/20 hover:from-blue-600 hover:to-purple-700"
                      : "cursor-not-allowed bg-gray-200 opacity-50 dark:bg-gray-700"
                  }`}
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </form>
        {!isAuthenticated && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-orange-400"></span>
              Guest mode - Limited magic.
              <button className="ml-1 text-purple-400 underline hover:text-purple-300">
                Unlock full power
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;
