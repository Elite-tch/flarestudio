"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GeneratorPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page since generator is now available as a floating button
        router.push("/");
    }, [router]);

    return null;
}
