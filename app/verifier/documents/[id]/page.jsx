"use client"
import { useState } from 'react'
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiLoader } from 'react-icons/fi'

const mockDocument = {
  id: '1234',
  type: 'Birth Certificate',
  issuer: 'City Hall of Metropolis',
  issuedTo: 'John Doe',
  issueDate: '2023-05-15',
  content: 'This is to certify that John Doe was born on January 1, 1990 in Metropolis General Hospital...',
  status: 'pending'
}

export default function DocumentReview({ params }) {
  const [document, setDocument] = useState(mockDocument)
  const [aiVerificationStatus, setAiVerificationStatus] = useState(null)
  const [manualVerificationStatus, setManualVerificationStatus] = useState(null)
  const [verificationNotes, setVerificationNotes] = useState('')

  const runAiVerification = async () => {
    setAiVerificationStatus('running')
    setTimeout(() => {
      setAiVerificationStatus('passed')
    }, 3000)
  }

  const submitManualVerification = (status) => {
    setManualVerificationStatus(status)
    setDocument({ ...document, status: status })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Document Review: {document.type}</h2>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Document Details</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Document ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.id}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Issuer</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.issuer}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Issued To</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.issuedTo}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.issueDate}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Content</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.content}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">AI Verification</h3>
          {aiVerificationStatus === null ? (
            <button
              onClick={runAiVerification}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Run AI Verification
            </button>
          ) : aiVerificationStatus === 'running' ? (
            <div className="flex items-center text-yellow-500">
              <FiLoader className="animate-spin mr-2" />
              AI Verification in progress...
            </div>
          ) : aiVerificationStatus === 'passed' ? (
            <div className="flex items-center text-green-500">
              <FiCheckCircle className="mr-2" />
              AI Verification passed
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <FiXCircle className="mr-2" />
              AI Verification failed
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Manual Verification</h3>
          <div className="space-y-4">
            <textarea
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              rows="3"
              placeholder="Enter verification notes..."
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
            ></textarea>
            <div className="flex space-x-3">
              <button
                onClick={() => submitManualVerification('verified')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Verify
              </button>
              <button
                onClick={() => submitManualVerification('rejected')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {manualVerificationStatus && (
        <div className={`bg-white shadow sm:rounded-lg ${
          manualVerificationStatus === 'verified' ? 'border-green-500' : 'border-red-500'
        } border-l-4`}>
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Verification Result</h3>
            <p className="text-sm text-gray-500">
              {manualVerificationStatus === 'verified' ? 
                'This document has been verified.' : 
                'This document has been rejected.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}