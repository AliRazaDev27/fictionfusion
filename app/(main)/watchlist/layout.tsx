export const metadata = {
  title: 'Watchlist',
  description: 'Custom WebScapper for MyDramaList',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>{children}</section>
  )
}