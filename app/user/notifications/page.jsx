"use client"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
  } from "@/components/ui/table"
  
  const notifications = [
    { id: 1, message: 'Your Birth Certificate has been verified', date: '2023-09-15', read: true },
    { id: 2, message: 'New document upload request', date: '2023-09-10', read: false },
    { id: 3, message: 'Profile information updated', date: '2023-09-05', read: true },
  ]
  
  export default function NotificationsPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.message}</TableCell>
                <TableCell>{notification.date}</TableCell>
                <TableCell>{notification.read ? 'Read' : 'Unread'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }