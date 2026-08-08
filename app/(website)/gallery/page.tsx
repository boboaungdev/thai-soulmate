import { Cta } from "@/components/cta"
import { UserGallery } from "@/components/profile-gallery"
import { MotionDiv } from "@/components/motion"

export default function GalleryPage() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main>
        <section className="py-12 md:py-24">
          <div className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-4 text-center">
              <h1 className="text-gradient text-4xl font-bold tracking-tighter md:text-5xl">
                Meet Some of Our Members
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
    </MotionDiv>
  )
}
