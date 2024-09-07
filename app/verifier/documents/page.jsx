"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchIssuedDocuments } from "@/actions/fetchDocuments";
import useWallet from "@/hooks/useWallet";
import Image from "next/image";
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

const DocumentsPage = () => {
  const { account } = useWallet();
  const [documents, setDocuments] = useState([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState("");
  const [verifierWalletAddress, setVerifierWalletAddress] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = setImage(null);

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

  const handleView = async () => {};

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
                <TableCell>{doc.status}</TableCell>
                <TableCell>{doc.ownerAddress}</TableCell>
                <TableCell>{doc.verifierAddress}</TableCell>
                <TableCell>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="text-white"
                    onClick={handleView}
                  >
                    View
                  </Button> */}
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
                            weight={100}
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
