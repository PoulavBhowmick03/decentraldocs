// components/ActivityLog.jsx
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
  } from "@/components/ui/table"
  
  const activityLog = [
    { id: 1, action: 'Document Uploaded', document: 'Birth Certificate', date: '2023-09-20' },
    { id: 2, action: 'Document Shared', document: 'Academic Transcript', date: '2023-09-18' },
    { id: 3, action: 'Document Verified', document: 'Work Experience', date: '2023-09-15' },
  ]
  
  export default function ActivityLog() {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLog.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.document}</TableCell>
                <TableCell>{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }