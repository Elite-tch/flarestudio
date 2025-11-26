import { Plus, MessageSquare, Trash2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatSidebar({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    className
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);

    // Handle responsive behavior
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setIsOpen(true);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#fff1f3] border-r">
            <div className="p-4 border-b">
                <Button
                    onClick={() => {
                        onNewChat();
                        if (isMobile) setIsOpen(false);
                    }}
                    className="w-full bg-[#e93b6c] hover:bg-[#e93b6c]  justify-start gap-2"
                    variant="default"
                >
                    <Plus size={16} />
                    New Chat
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                    {sessions.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm p-4">
                            No history yet. Start a new chat!
                        </div>
                    )}
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={cn(
                                "group flex items-center justify-between p-2 rounded-lg text-sm transition-colors cursor-pointer",
                                currentSessionId === session.id
                                    ? " bg-background text-primary font-medium"
                                    : "hover:bg-background text-muted-foreground hover:text-foreground"
                            )}
                            onClick={() => {
                                onSelectSession(session.id);
                                if (isMobile) setIsOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <MessageSquare size={16} className="shrink-0" />
                                <span className="truncate">
                                    {session.title && session.title.length > 25 
                                        ? `${session.title.substring(0, 25)}...` 
                                        : (session.title || "New Chat")}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSessionToDelete(session.id);
                                }}
                            >
                                <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );

    if (isMobile) {
        return (
            <>
                <Button
                    variant="ghost"
                    size="icon"
                    className="fixed top-4 left-4 z-50 md:hidden"
                    onClick={toggleSidebar}
                >
                    {isOpen ? <X /> : <Menu />}
                </Button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                                onClick={() => setIsOpen(false)}
                            />
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r shadow-lg md:hidden"
                            >
                                <SidebarContent />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <>
            <div className={cn("w-72 hidden md:block h-full", className)}>
                <SidebarContent />
            </div>

            <Dialog open={!!sessionToDelete} onOpenChange={(open) => !open && setSessionToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Chat?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this chat? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSessionToDelete(null)}>
                            Cancel
                        </Button>
                        <Button
                        className='bg-[#e93b6c] hover:bg-[#e93b6c]'
                            variant="destructive"
                            onClick={() => {
                                if (sessionToDelete) {
                                    onDeleteSession(sessionToDelete);
                                    setSessionToDelete(null);
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
