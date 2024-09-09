"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const DocumentsPage = () => {
  const { account } = useWallet();
  const [documents, setDocuments] = useState([]);
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
      // Show loading status for the document
      setVerificationStatus((prev) => ({ ...prev, [doc.id]: "loading" }));

      const result = await verifyDocument(doc.id);

      if (result.success) {
        // Update the status to "verified" and reload documents
        setVerificationStatus((prev) => ({ ...prev, [doc.id]: "verified" }));
        await loadDocuments(); // Refresh documents list after verification
      } else {
        // Handle error during verification
        setVerificationStatus((prev) => ({ ...prev, [doc.id]: "error" }));
        setUploadStatus({
          type: "error",
          message: result.message,
        });
      }
    } catch (error) {
      // Handle unexpected errors
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
                  {doc.isVerified ? "Verified" : "Not Verified"}
                </TableCell>
                <TableCell>{doc.ownerAddress}</TableCell>
                <TableCell>{doc.verifierAddress}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-black"
                    onClick={() => handleVerify(doc)}
                    disabled={
                      verificationStatus[doc.id] === "loading" ||
                      doc.isVerified
                    }
                  >
                    {verificationStatus[doc.id] === "loading" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying
                      </>
                    ) : doc.isVerified ? (
                      "Verified"
                    ) : (
                      "Verify"
                    )}
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
