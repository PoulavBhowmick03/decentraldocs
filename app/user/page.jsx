import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
            <Button className="mt-4">View All</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              <li>Birth Certificate verified</li>
              <li>Academic Transcript added</li>
              <li>Profile updated</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">Upload New Document</Button>
            <Button className="w-full" variant="outline">Request Verification</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
