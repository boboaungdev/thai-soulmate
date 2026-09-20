import { EmailSignature } from "@/features/shared/emails"

export default function EmailSignaturePreviewPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EE] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[640px]">
        <div id="email-signature-render-target" className="w-full">
          <EmailSignature />
        </div>
      </div>
    </div>
  )
}
