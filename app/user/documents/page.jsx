"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { issueDocument } from "@/actions/issue";
import { fetchIssuedDocuments } from "@/actions/fetchDocuments";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DocumentsPage = () => {
  const { account } = useWallet();
  const [documents, setDocuments] = useState([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [verifierWalletAddress, setVerifierWalletAddress] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account) {
      loadDocuments();
    }
  }, [account]);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const result = await fetchIssuedDocuments(account);
      if (result.success) {
        setDocuments(result.documents);
        console.log(result.documents)
      } else {
        setUploadStatus({
          type: "error",
          message: result.message || "Failed to fetch documents",
        });
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      setUploadStatus({
        type: "error",
        message: "Error loading documents. Please try again.",
      });
    }
    setIsLoading(false);
  };

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
      const flaskResponse = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
          type: "OTHER",
        };

        console.log("Issuing document with data:", issueData);

        const issueResponse = await issueDocument(issueData);

        console.log("Issue document response:", issueResponse);

        if (issueResponse.success) {
          setUploadStatus({
            type: "success",
            message: "Document uploaded and issued successfully!",
          });
          setIsUploadDialogOpen(false);
          setUserWalletAddress("");
          setVerifierWalletAddress("");
          setFile(null);
          loadDocuments(); // Refresh the documents list
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
        <h1 className="text-3xl font-bold">My Issued Documents</h1>
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
                <Label htmlFor="verifierWalletAddress">
                  Verifier Wallet Address
                </Label>
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

      {isLoading ? (
        <div>Loading documents...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner Address</TableHead>
              <TableHead>Verifier Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>
                  {new Date(doc.issueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{doc.status}</TableCell>
                <TableCell>{doc.ownerAddress}</TableCell>
                <TableCell>{doc.verifierAddress}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger>View</AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Certificate</AlertDialogTitle>
                        <AlertDialogDescription>
                          <Image
                            alt="cert"
                            src={`https://gateway.pinata.cloud/ipfs/${doc.blockchainHash}`}
                            height={100}
                            width={100}
                          />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>Okay</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DocumentsPage;