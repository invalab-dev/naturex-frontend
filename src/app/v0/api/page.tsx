import { ApiButtonDemo } from "@/app/v0/api/components/api-button-demo"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">API 호출 버튼 데모</h1>
        <ApiButtonDemo />
      </div>
    </main>
  )
}
