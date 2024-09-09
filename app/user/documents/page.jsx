/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, Eye, X } from "lucide-react";

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
      const flaskResponse = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (flaskResponse.data.success) {
        const issueData = {
          blockchainHash: flaskResponse.data.ipfsHash,
          ownerId: userWalletAddress,
          issuerId: account,
          verifierId: verifierWalletAddress,
          description: "Document uploaded via web interface",
          name: file.name,
          type: "OTHER",
        };

        const issueResponse = await issueDocument(issueData);

        if (issueResponse.success) {
          setUploadStatus({
            type: "success",
            message: "Document uploaded and issued successfully!",
          });
          setIsUploadDialogOpen(false);
          setUserWalletAddress("");
          setVerifierWalletAddress("");
          setFile(null);
          loadDocuments();
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

  const getIpfsUrl = (hash) => {
    return `https://aquamarine-impressed-ant-623.mypinata.cloud/ipfs/${hash}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6 min-h-screen"
    >
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          My Issued Documents
        </motion.h1>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload New Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                  className="mt-1"
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
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="documentFile">Upload File</Label>
                <Input
                  id="documentFile"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                Upload
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Alert
              variant={uploadStatus.type === "error" ? "destructive" : "default"}
            >
              <AlertTitle>
                {uploadStatus.type === "error" ? "Error" : "Success"}
              </AlertTitle>
              <AlertDescription>{uploadStatus.message}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <span>Loading documents...</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
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
              {documents.map((doc, index) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    {new Date(doc.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        doc.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {doc.isVerified ? "Verified" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {doc.ownerAddress.slice(0, 6)}...
                    {doc.ownerAddress.slice(-4)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {doc.verifierAddress.slice(0, 6)}...
                    {doc.verifierAddress.slice(-4)}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Certificate</AlertDialogTitle>
                          <AlertDialogDescription>
                            {doc.blockchainHash ? (
                              <div className="relative w-full h-64">
                                <Image
                                  alt="Certificate"
                                  src={getIpfsUrl(doc.blockchainHash)}
                                  layout="fill"
                                  objectFit="contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-image.png";
                                  }}
                                />
                              </div>
                            ) : (
                              <p>No image available</p>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction>
                            <X className="mr-2 h-4 w-4" /> Close
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DocumentsPage;