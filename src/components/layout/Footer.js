import Link from "next/link";
import { Twitter, Send, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#fff1f3]  border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    {/* Brand & Rights */}
                    <div className="text-center md:text-left space-y-2">
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                            <span className="font-bold text-xl text-gray-900 tracking-tight">
                                FlareStudio
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} FlareStudio. All rights reserved.
                        </p>
                    </div>

                    {/* Social & Support */}
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex gap-4">
                            <Link
                                href="https://x.com/FlareStudioXYZ?t=bvCfbhLAi6FUwLGn1uNnsQ&s=09"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-black hover:text-white transition-all group"
                                aria-label="Twitter / X"
                            >
                                {/* Simple X representation or Twitter Icon */}
                                <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                            </Link>
                            <Link
                                href="https://t.me/Johnboscoizuchukwu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-50 text-gray-600 rounded-full hover:bg-[#0088cc] hover:text-white transition-all group"
                                aria-label="Telegram Support"
                            >
                                <Send size={20} className="group-hover:scale-110 transition-transform -ml-0.5 mt-0.5" />
                            </Link>
                        </div>
                        <p className="text-xs text-gray-400">
                            Need help? DM us on Telegram for support & feedback.
                        </p>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="mt-8 pt-8 border-t border-gray-50 text-center">
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        Built with <Heart size={12} className="text-pink-500 fill-pink-500" /> for the Flare Community
                    </p>
                </div>
            </div>
        </footer>
    );
}
