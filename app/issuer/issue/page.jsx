"use client";
import React, { useState } from "react";
import axios from "axios";
import { issueDocument } from "@/actions/issue";
// import accou
import useWallet from "@/hooks/useWallet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MdAccountBalance } from "react-icons/md";

const DocumentsPage = () => {
  const { account } = useWallet();
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Birth Certificate",
      issueDate: "2023-01-15",
      status: "Verified",
    },
    {
      id: 2,
      name: "Academic Transcript",
      issueDate: "2023-05-20",
      status: "Pending",
    },
    {
      id: 3,
      name: "Work Experience",
      issueDate: "2023-08-10",
      status: "Verified",
    },
  ]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [documentName1, setDocumentName1] = useState("");
  const [documentName0, setDocumentName0] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [ipfs, setIpfs] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus({
        type: "error",
        message: "Please select a file to upload.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5000/abc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.PINATA_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      setIpfs(ipfsHash);

      await issueDocument(
        {
          blockchainHash: ipfsHash,
          ownerId: documentName0,
          issuerId: account,
          verifierId: documentName1,
          // verifier: documentName1,
          description: "Document Description",
        },
        response
      );

      const newDocument = {
        id: documents.length + 1,
        name: documentName0 || file.name,
        issueDate: new Date().toISOString().split("T")[0],
        status: "Pending",
      };

      setDocuments([...documents, newDocument]);
      setUploadStatus({
        type: "success",
        message: "Document uploaded successfully!",
      });
      setIsUploadDialogOpen(false);
      setDocumentName0("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadStatus({
        type: "error",
        message: "Error uploading document. Please try again.",
      });
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
                <Label htmlFor="documentName">Wallet Address</Label>
                <Input
                  id="documentName"
                  value={documentName0}
                  onChange={(e) => setDocumentName0(e.target.value)}
                  placeholder="Enter User Wallet Address"
                />
              </div>
              <div>
                <Label htmlFor="documentName">Wallet Address</Label>
                <Input
                  id="documentName"
                  value={documentName1}
                  onChange={(e) => setDocumentName1(e.target.value)}
                  placeholder="Enter Verifier Wallet Address"
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
        <Alert
          variant={uploadStatus.type === "error" ? "destructive" : "default"}
        >
          <AlertTitle>
            {uploadStatus.type === "error" ? "Error" : "Success"}
          </AlertTitle>
          <AlertDescription>{uploadStatus.message}</AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet Address</TableHead>
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
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsPage;
