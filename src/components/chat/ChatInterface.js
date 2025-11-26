import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

const QUICK_START_QUESTIONS = [
    "How do I make an FDC attestation request?",
    "Show me how to fetch Web2JSON data.",
    "Write a script to deploy an ERC20 token.",
    "Explain FTSO data feeds."
];

export function ChatInterface({ sessionId, onUpdateTitle }) {
    // Initial state: Welcome message
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "👋 Hi! I'm **Flare AI**.\n\nI can help you build on the Flare Network using **Hardhat** or **Foundry**."
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState(QUICK_START_QUESTIONS);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const messagesEndRef = useRef(null);

    // Load data for specific session
    useEffect(() => {
        if (!sessionId) return;

        const savedData = localStorage.getItem(`session_${sessionId}_data`);

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.messages) setMessages(parsed.messages);
                if (parsed.suggestedQuestions) setSuggestedQuestions(parsed.suggestedQuestions);
            } catch (e) {
                console.error("Failed to parse session data", e);
            }
        } else {
            // Reset to default if no data for this session
            setMessages([{
                role: "assistant",
                content: " Hi! I'm FlareStudio AI.\n\nI can help you build on the Flare Network using Hardhat or Foundry."
            }]);
            setSuggestedQuestions(QUICK_START_QUESTIONS);
        }
        setIsInitialized(true);
    }, [sessionId]);

    // Save data for specific session
    useEffect(() => {
        if (isInitialized && sessionId) {
            const dataToSave = {
                messages,
                suggestedQuestions
            };
            localStorage.setItem(`session_${sessionId}_data`, JSON.stringify(dataToSave));
        }
    }, [messages, suggestedQuestions, isInitialized, sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast.success("Code copied!");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSuggestionClick = (question) => {
        setInput(question);
        // Optional: Auto-submit
        // handleSubmit(null, question); 
    };

    const handleSubmit = async (e, overrideInput = null) => {
        if (e) e.preventDefault();
        const textToSend = overrideInput || input;

        if (!textToSend.trim() || isLoading) return;

        const userMsg = { role: "user", content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);
        setSuggestedQuestions([]); // Clear suggestions while thinking

        // Update title if it's the first user message
        if (messages.length === 1 && onUpdateTitle) {
            const title = textToSend.length > 30 ? textToSend.substring(0, 30) + "..." : textToSend;
            onUpdateTitle(title);
        }

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: messages,
                    message: userMsg.content
                }),
            });

            if (!response.ok) throw new Error("Failed to get response");

            const data = await response.json();

            const aiMsg = {
                role: "assistant",
                content: data.response
            };

            setMessages(prev => [...prev, aiMsg]);

            if (data.suggestedQuestions && Array.isArray(data.suggestedQuestions)) {
                setSuggestedQuestions(data.suggestedQuestions);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-[#fff1f3] border rounded-xl shadow-sm overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex flex-col gap-2 w-fit",
                            msg.role === "user" ? "ml-auto items-end max-w-[95%] md:max-w-[90%]" : "mr-auto items-start max-w-[95%] md:max-w-[90%]"
                        )}
                    >
                        <div className={cn(
                            "flex items-start gap-3 w-full",
                            msg.role === "user" ? "flex-row-reverse" : ""
                        )}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={cn(
                                "p-4 rounded-lg text-sm overflow-hidden w-full",
                                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 border"
                            )}>
                                <div className="whitespace-pre-wrap markdown-body">
                                    {/* Markdown rendering with Copy button */}
                                    {msg.content.split("```").map((part, i) => {
                                        if (i % 2 === 1) {
                                            // Code block
                                            const codeIndex = `${idx}-${i}`;
                                            return (
                                                <div key={i} className="relative group my-3">
                                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6 text-white hover:bg-white/20"
                                                            onClick={() => handleCopy(part, codeIndex)}
                                                        >
                                                            {copiedIndex === codeIndex ? <Check size={14} /> : <Copy size={14} />}
                                                        </Button>
                                                    </div>
                                                    <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-md overflow-x-auto text-xs font-mono border border-white/10">
                                                        <code>{part.trim().replace(/^[a-z]+\n/, "")}</code>
                                                    </pre>
                                                </div>
                                            );
                                        }
                                        // Regular text
                                        return <span key={i} className="leading-relaxed">{part}</span>;
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm p-4 pl-11">
                        <Sparkles className="w-4 h-4 animate-pulse text-primary" />
                        <span className="animate-pulse">Thinking...</span>
                    </div>
                )}

                {/* Suggested Questions */}
                {!isLoading && suggestedQuestions.length > 0 && (
                    <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSubmit(null, q)}
                                className="text-left text-sm p-3 rounded-lg border bg-background hover:bg-muted/50 hover:border-primary/50 transition-all text-muted-foreground hover:text-foreground flex items-center justify-between group"
                            >
                                <span>{q}</span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </button>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={(e) => handleSubmit(e)} className="p-4 border-t bg-muted/20 flex gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Flare AI anything..."
                    className="min-h-[50px] resize-none shadow-sm"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-[50px] w-[50px] bg-[#e93b6c]">
                    <Send size={20} />
                </Button>
            </form>
        </div>
    );
}
