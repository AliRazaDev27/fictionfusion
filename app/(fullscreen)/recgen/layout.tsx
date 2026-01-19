import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Recommendation Generator",
    description: "AI based recommendation generator with Groq models with JSON Schema supported"
}
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            {children}
        </section>
    )
}