"use client"

import { ApiButton } from "@/app/v0/api/components/api-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// 가짜 API 호출 함수들
const mockApiCalls = {
  fetchData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("데이터를 가져왔습니다!")
  },

  sendMessage: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("메시지를 전송했습니다!")
  },

  uploadFile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log("파일을 업로드했습니다!")
  },

  deleteItem: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("항목을 삭제했습니다!")
  },
}

export function ApiButtonDemo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API 호출 버튼 예시</CardTitle>
          <CardDescription>
            각 버튼은 서로 다른 클릭 제한이 있으며, 비동기 작업 중에는 로딩 상태를 표시합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">기본 버튼들</h3>

              <ApiButton onClick={mockApiCalls.fetchData} maxClicks={5} variant="default">
                데이터 가져오기 (5회 제한)
              </ApiButton>

              <ApiButton onClick={mockApiCalls.sendMessage} maxClicks={3} variant="secondary">
                메시지 전송 (3회 제한)
              </ApiButton>

              <ApiButton onClick={mockApiCalls.uploadFile} maxClicks={2} variant="outline">
                파일 업로드 (2회 제한)
              </ApiButton>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">특수 버튼들</h3>

              <ApiButton onClick={mockApiCalls.deleteItem} maxClicks={1} variant="destructive">
                항목 삭제 (1회만 가능)
              </ApiButton>

              <ApiButton onClick={mockApiCalls.fetchData} maxClicks={10} variant="ghost" size="sm">
                작은 버튼 (10회 제한)
              </ApiButton>

              <ApiButton onClick={mockApiCalls.sendMessage} maxClicks={0} variant="outline" disabled>
                비활성화된 버튼
              </ApiButton>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">사용법:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 버튼을 클릭하면 API 호출이 시작됩니다</li>
              <li>• 작업 중에는 로딩 스피너가 표시되고 버튼이 비활성화됩니다</li>
              <li>• 각 버튼마다 설정된 최대 클릭 횟수가 있습니다</li>
              <li>• 제한에 도달하면 경고 메시지가 표시됩니다</li>
              <li>• 콘솔을 열어 API 호출 결과를 확인하세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
