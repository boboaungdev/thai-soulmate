import { Cta } from "@/components/cta"
import { UserGallery } from "@/components/user-gallery"

export default function GalleryPage() {
  return (
    <main>
      <section className="py-12 md:py-24">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
              Meet Our Members
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Explore the profiles of our vibrant community. Your next
              connection could be just a click away.
            </p>
          </div>
          <UserGallery layout="grid" />
        </div>
      </section>
      <Cta />
    </main>
  )
}
