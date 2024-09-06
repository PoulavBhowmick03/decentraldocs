"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Birth Certificate', issueDate: '2023-01-15', status: 'Verified' },
    { id: 2, name: 'Academic Transcript', issueDate: '2023-05-20', status: 'Pending' },
    { id: 3, name: 'Work Experience', issueDate: '2023-08-10', status: 'Verified' },
  ]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/abc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newDocument = {
        id: documents.length + 1,
        name: documentName || file.name,
        issueDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };

      setDocuments([...documents, newDocument]);
      setUploadStatus({ type: 'success', message: 'Document uploaded successfully!' });
      setIsUploadDialogOpen(false);
      setDocumentName('');
      setFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadStatus({ type: 'error', message: 'Error uploading document. Please try again.' });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>Upload New Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="documentName">Document Name</Label>
                <Input 
                  id="documentName" 
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name" 
                />
              </div>
              <div>
                <Label htmlFor="documentFile">Upload File</Label>
                <Input 
                  id="documentFile" 
                  type="file" 
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <Button type="submit">Upload</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {uploadStatus && (
        <Alert variant={uploadStatus.type === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>{uploadStatus.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{uploadStatus.message}</AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{doc.issueDate}</TableCell>
              <TableCell>{doc.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsPage;