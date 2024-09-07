"use client";
import React, { useState } from "react";
import axios from "axios";
import { issueDocument } from "@/actions/issue";
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

const DocumentsPage = () => {
  const { account } = useWallet();
  const [documents, setDocuments] = useState([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [verifierWalletAddress, setVerifierWalletAddress] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !userWalletAddress || !verifierWalletAddress) {
      setUploadStatus({
        type: "error",
        message: "Please fill all fields and select a file to upload.",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_wallet_address", userWalletAddress);
    formData.append("verifier_wallet_address", verifierWalletAddress);
    formData.append("issuer_wallet_address", account);
  
    try {
      // Step 1: Upload to Flask server
      const flaskResponse = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Flask server response:", flaskResponse.data);
  
      if (flaskResponse.data.success) {
        // Step 2: Issue document using Next.js server action
        const issueData = {
          blockchainHash: flaskResponse.data.ipfsHash,
          ownerId: userWalletAddress,
          issuerId: account,
          verifierId: verifierWalletAddress,
          description: "Document uploaded via web interface",
          name: file.name,
        };
  
        console.log("Issuing document with data:", issueData);
  
        const issueResponse = await issueDocument(issueData);
  
        console.log("Issue document response:", issueResponse);
  
        if (issueResponse.success) {
          const newDocument = {
            id: issueResponse.document.id,
            name: issueResponse.document.name,
            issueDate: new Date(issueResponse.document.issuedAt).toISOString().split("T")[0],
            status: "Issued",
          };
  
          setDocuments([...documents, newDocument]);
          setUploadStatus({
            type: "success",
            message: "Document uploaded and issued successfully!",
          });
          setIsUploadDialogOpen(false);
          setUserWalletAddress("");
          setVerifierWalletAddress("");
          setFile(null);
        } else {
          throw new Error(issueResponse.message || "Failed to issue document");
        }
      } else {
        throw new Error(flaskResponse.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error in handleUpload:", error);
      setUploadStatus({
        type: "error",
        message: error.message || "Error uploading document. Please try again.",
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
                <Label htmlFor="userWalletAddress">User Wallet Address</Label>
                <Input
                  id="userWalletAddress"
                  value={userWalletAddress}
                  onChange={(e) => setUserWalletAddress(e.target.value)}
                  placeholder="Enter User Wallet Address"
                />
              </div>
              <div>
                <Label htmlFor="verifierWalletAddress">Verifier Wallet Address</Label>
                <Input
                  id="verifierWalletAddress"
                  value={verifierWalletAddress}
                  onChange={(e) => setVerifierWalletAddress(e.target.value)}
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