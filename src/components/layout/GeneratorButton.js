"use client";

import { useState } from "react";
import { Sparkles, MessageSquare } from "lucide-react";
import { GeneratorModal } from "./GeneratorModal";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function GeneratorButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-10 right-10 z-50 bg-[#e93b6c] text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center group hover:bg-[#d12d5a]"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Open FlareStudio AI Assistant"
                    >
                        <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
                    </motion.button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-[#e93b6c] text-white border-none">
                    <p className="font-semibold">Ask FlareStudio AI</p>
                </TooltipContent>
            </Tooltip>

            <GeneratorModal open={isOpen} onOpenChange={setIsOpen} />
        </div>
    );
}

