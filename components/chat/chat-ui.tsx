import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChatMessage, useAssistantStore } from "@/stores/assistantStore";
import { Bot, Mic, MicOff, Send, User, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { quickReplies } from "@/config/chat";
import { useUser } from "@/hooks/use-user";

interface ChatUIProps {
  isAuthenticated: boolean;
  userName: string;
  onSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  onVoiceRecord: (transcript: string) => void;
  onQuickReply: (reply: string) => void;
  messages: Array<ChatMessage>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  status: string;
}

const ChatUI: React.FC<ChatUIProps> = ({
  isAuthenticated = false,
  userName = "Guest",
  onSendMessage,
  onVoiceRecord,
  onQuickReply,
  messages = [],
  input,
  handleInputChange,
  isLoading = false,
  status,
}) => {
  // const { isInvoiceLimitReached, isTokenLimitReached, usage } =
  //   useAssistantStore();

  const { usageLimit } = useUser();

  const isTokenLimitReached = useAssistantStore((s) =>
    s.isTokenLimitReached(usageLimit),
  );

  const [isRecordingSupported, setIsRecordingSupported] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { transcript, listening, resetTranscript, isMicrophoneAvailable } =
    useSpeechRecognition();

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.warn("Your browser doesn't support speech recognition.");
      setIsRecordingSupported(false);
    }
  }, []);

  const toggleRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        onVoiceRecord(transcript);
      }
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      }).catch(console.error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Only submit if not loading, not at token limit, and has input
      if (!isLoading && !isTokenLimitReached && input.trim()) {
        // Create a synthetic form event or call submit directly
        const form = e.currentTarget.form;
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  const handleQuickReply = (reply: string) => {
    if (!isLoading && !isTokenLimitReached && reply.trim()) {
      onQuickReply(reply);
    }
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
                AI Invoice Assistant
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
          <div className="flex min-h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
              Ready to Create Magic?
            </h2>
            <p className="mb-6 max-w-md text-gray-500 dark:text-gray-400">
              {`I'm your AI invoice wizard! Tell me what you need and watch as I
              conjure up the perfect invoice.`}
            </p>
            <div className="grid max-w-md grid-cols-1 gap-3 text-sm">
              {quickReplies.map((reply, index) => {
                return (
                  <div
                    key={index}
                    className="cursor-pointer rounded-lg border border-gray-300 bg-white p-3 transition-colors hover:border-purple-500/50 dark:border-gray-700/50 dark:bg-gray-800/50"
                  >
                    <p
                      className="text-gray-600 dark:text-gray-400"
                      onClick={() => handleQuickReply(reply)}
                    >
                      {reply}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isStreaming =
              status === "streaming" && index === messages.length - 1;
            const linkClass =
              message.role === "user"
                ? "text-yellow-300 hover:text-yellow-500"
                : "text-blue-600 hover:text-blue-800";
            return (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-sm lg:max-w-md ${message.role === "user" ? "flex-row-reverse" : "flex-row"} items-start space-x-3`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
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
                    {isStreaming ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${linkClass} underline`}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
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
        <form ref={formRef} onSubmit={onSendMessage}>
          <div className="relative mx-auto max-w-3xl rounded-xl border border-gray-300 bg-gray-50 shadow-sm dark:border-gray-700/50 dark:bg-gray-800/50">
            <div className="flex items-end space-x-3 p-3">
              <textarea
                value={input}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                placeholder={`${isTokenLimitReached ? "You have reached your token limit. Sign up now to unlock full power." : "Ask AI assistant anything..."}`}
                className="min-h-[48px] w-full resize-none bg-transparent p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
                disabled={isLoading || isTokenLimitReached}
                rows={3}
              ></textarea>
              <div className="flex items-center space-x-2 pb-2">
                <button
                  type="button"
                  // onClick={handleVoiceRecord}
                  onClick={toggleRecording}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-1000 ${
                    listening
                      ? "animate-pulse bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  }`}
                  disabled={isLoading || !isRecordingSupported}
                >
                  {isRecordingSupported ? (
                    <Mic className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <MicOff className="h-5 w-5 text-white" />
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
              <Link
                href="/register"
                className="ml-1 text-purple-400 underline hover:text-purple-300"
              >
                Unlock full power
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;
