"use client";

import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function GeneratorModal({ open, onOpenChange }) {
    // Multi-session state
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Load sessions on mount
    useEffect(() => {
        if (!open) return;
        
        const savedSessions = localStorage.getItem("chat_sessions");
        const savedCurrentId = localStorage.getItem("current_session_id");

        if (savedSessions) {
            const parsedSessions = JSON.parse(savedSessions);
            setSessions(parsedSessions);

            if (savedCurrentId && parsedSessions.find(s => s.id === savedCurrentId)) {
                setCurrentSessionId(savedCurrentId);
            } else if (parsedSessions.length > 0) {
                setCurrentSessionId(parsedSessions[0].id);
            } else {
                createNewSession();
            }
        } else {
            createNewSession();
        }
    }, [open]);

    // Save sessions and current ID
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem("chat_sessions", JSON.stringify(sessions));
        }
    }, [sessions]);

    useEffect(() => {
        if (currentSessionId) {
            localStorage.setItem("current_session_id", currentSessionId);
        }
    }, [currentSessionId]);

    const createNewSession = () => {
        const newId = uuidv4();
        const newSession = {
            id: newId,
            title: "New Chat",
            timestamp: Date.now()
        };

        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newId);
    };

    const handleDeleteSession = (sessionId) => {
        const newSessions = sessions.filter(s => s.id !== sessionId);
        setSessions(newSessions);
        localStorage.removeItem(`session_${sessionId}_data`);
        localStorage.removeItem(`chat_history_${sessionId}`);

        if (currentSessionId === sessionId) {
            if (newSessions.length > 0) {
                setCurrentSessionId(newSessions[0].id);
            } else {
                createNewSession();
            }
        }
        toast.success("Chat deleted");
    };

    const handleSessionSelect = (sessionId) => {
        setCurrentSessionId(sessionId);
    };

    const updateSessionTitle = (sessionId, title) => {
        setSessions(prev => prev.map(s =>
            s.id === sessionId ? { ...s, title } : s
        ));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                className="md:max-w-[85vw]  w-full h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden max-w-[95vw]"
                showCloseButton={true}
            >
                <div className="flex h-full overflow-hidden bg-[#fff1f3]">
                    <ChatSidebar
                        sessions={sessions}
                        currentSessionId={currentSessionId}
                        onSelectSession={handleSessionSelect}
                        onNewChat={createNewSession}
                        onDeleteSession={handleDeleteSession}
                    />

                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="container mx-auto py-6 px-4 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <div>
                                    <h1 className="md:text-2xl text-xl font-bold tracking-tight pt-8 md:pt-0">
                                        FlareStudio AI Assistant
                                    </h1>
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`chat-${currentSessionId}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="h-full"
                                    >
                                        {currentSessionId ? (
                                            <ChatInterface
                                                key={currentSessionId}
                                                sessionId={currentSessionId}
                                                onUpdateTitle={(title) => updateSessionTitle(currentSessionId, title)}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                <div className="text-center">
                                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                                    <p>Initializing chat...</p>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

