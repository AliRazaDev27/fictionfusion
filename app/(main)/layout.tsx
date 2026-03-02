import Header from "@/components/header";
import { Suspense } from "react";
import LoaderHeader from "@/app/loaderHeader";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Suspense fallback={<LoaderHeader />}>
        <Header />
      </Suspense>
      <section>{children}</section>
    </>
  )

}