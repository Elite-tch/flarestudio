import { Sidebar } from "@/components/proofrails/Sidebar";


export default function DocsLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#ffe4e8]">
            <Sidebar />
            <main className="flex-1 md:ml-64 min-w-0">
                <div className="max-w-4xl mx-auto px-6 py-10 md:pb-16 pt-4 md:pt-32">
                    <div className=" max-w-none">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
