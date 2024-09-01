"use client";
import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

const mockVerifiedDocuments = [
  {
    id: "1234",
    type: "Birth Certificate",
    issuedTo: "John Doe",
    verificationDate: "2023-06-01",
  },
  {
    id: "5678",
    type: "Diploma",
    issuedTo: "Jane Smith",
    verificationDate: "2023-05-28",
  },
];

export default function VerifiedDocuments() {
  const [documents, setDocuments] = useState(mockVerifiedDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 10;
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = documents.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filtered = mockVerifiedDocuments.filter(
      (doc) =>
        doc.id.includes(event.target.value) ||
        doc.type.toLowerCase().includes(event.target.value.toLowerCase()) ||
        doc.issuedTo.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setDocuments(filtered);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedDocuments = [...documents].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setDocuments(sortedDocuments);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <FiChevronUp />
      ) : (
        <FiChevronDown />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Verified Documents
      </h2>

      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Type", "Issued To", "Verification Date"].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() =>
                      handleSort(header.toLowerCase().replace(" ", ""))
                    }
                  >
                    <div className="flex items-center">
                      {header}
                      {getSortIcon(header.toLowerCase().replace(" ", ""))}
                    </div>
                  </th>
                )
              )}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {document.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {document.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {document.issuedTo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {document.verificationDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/verifier/documents/${document.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          documentsPerPage={documentsPerPage}
          totalDocuments={documents.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
function Pagination({
  documentsPerPage,
  totalDocuments,
  paginate,
  currentPage,
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalDocuments / documentsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6">
      <div className="hidden md:-mt-px md:flex">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`${
              currentPage === number
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium`}
          >
            {number}
          </button>
        ))}
      </div>
    </nav>
  );
}
