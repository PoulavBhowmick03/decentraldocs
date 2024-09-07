/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { verifyDocument } from "@/actions/verify";
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
  const [verificationStatus, setVerificationStatus] = useState({});

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

  const handleVerify = async (doc) => {
    try {
      setVerificationStatus((prev) => ({ ...prev, [doc.id]: "loading" }));

      const result = await verifyDocument(doc.id, account);

      if (result.success) {
        if (result.verified) {
          setVerificationStatus((prev) => ({ ...prev, [doc.id]: "verified" }));
        } else {
          setVerificationStatus((prev) => ({ ...prev, [doc.id]: "anomaly" }));
        }
        // Refresh the documents list
        await loadDocuments();
      } else {
        setVerificationStatus((prev) => ({ ...prev, [doc.id]: "error" }));
        console.error("Verification failed:", result.message);
        // You might want to show this error message to the user
        setUploadStatus({
          type: "error",
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Error in verification:", error);
      setVerificationStatus((prev) => ({ ...prev, [doc.id]: "error" }));
      setUploadStatus({
        type: "error",
        message: "An unexpected error occurred during verification.",
      });
    }
  };
  return (
    <div className="space-y-6 p-6 bg-transparent text-black">
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
            <form className="space-y-4">
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
                <TableCell>
                  {verificationStatus[doc.id] === "verified"
                    ? "Verified"
                    : verificationStatus[doc.id] === "anomaly"
                    ? "Anomaly Detected"
                    : doc.status}
                </TableCell>
                <TableCell>{doc.ownerAddress}</TableCell>
                <TableCell>{doc.verifierAddress}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white"
                    onClick={() => handleVerify(doc)}
                    disabled={
                      verificationStatus[doc.id] === "loading" ||
                      verificationStatus[doc.id] === "verified"
                    }
                  >
                    {verificationStatus[doc.id] === "loading"
                      ? "Verifying..."
                      : verificationStatus[doc.id] === "verified"
                      ? "Verified"
                      : verificationStatus[doc.id] === "anomaly"
                      ? "Anomaly Detected"
                      : "Verify"}
                  </Button>
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
