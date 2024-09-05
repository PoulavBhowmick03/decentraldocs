// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentVerification {
    enum UserRole { INDIVIDUAL, ISSUING_AUTHORITY, VERIFYING_AUTHORITY }
    enum OrganizationType { SCHOOL, UNIVERSITY, GOVERNMENT_AGENCY, PRIVATE_COMPANY, OTHER }
    enum VerifierType { GOVERNMENT_OFFICE, BANK, LEGAL_ENTITY, EDUCATIONAL_INSTITUTION, CORPORATE_ENTITY, OTHER }
    enum DocumentType { BIRTH_CERTIFICATE, ACADEMIC_TRANSCRIPT, IDENTIFICATION_CARD, EXPERIENCE_CERTIFICATE, OTHER }
    enum VerificationStatus { PENDING, VERIFIED, REJECTED }

    struct User {
        address walletAddress;
        string email;
        UserRole role;
        string firstName;
        string lastName;
        string organizationName;
        uint256[] ownedDocuments;
    }

    struct Issuer {
        address walletAddress;
        OrganizationType organizationType;
        string licenseNumber;
        uint256[] issuedDocuments;
    }

    struct Verifier {
        address walletAddress;
        VerifierType organizationType;
        string licenseNumber;
    }

    struct Document {
        uint256 id;
        DocumentType docType;
        string title;
        string contentHash;
        address issuer;
        address owner;
        VerificationStatus status;
        uint256 issuedAt;
    }

    mapping(address => User) public users;
    mapping(address => Issuer) public issuers;
    mapping(address => Verifier) public verifiers;
    mapping(uint256 => Document) public documents;
    uint256 public documentCount = 0;

    event UserRegistered(address indexed user, UserRole role);
    event IssuerRegistered(address indexed issuer, OrganizationType organizationType, string licenseNumber);
    event VerifierRegistered(address indexed verifier, VerifierType organizationType, string licenseNumber);
    event DocumentIssued(uint256 indexed documentId, address indexed issuer, address indexed owner);
    event DocumentVerified(uint256 indexed documentId, VerificationStatus status);

    modifier onlyIssuer() {
        require(users[msg.sender].role == UserRole.ISSUING_AUTHORITY, "Only issuing authorities can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(users[msg.sender].role == UserRole.VERIFYING_AUTHORITY, "Only verifying authorities can perform this action");
        _;
    }

    function registerUser(
        string memory _email,
        UserRole _role,
        string memory _firstName,
        string memory _lastName,
        string memory _organizationName
    ) public {
        require(users[msg.sender].walletAddress == address(0), "User already registered");

        users[msg.sender] = User({
            walletAddress: msg.sender,
            email: _email,
            role: _role,
            firstName: _firstName,
            lastName: _lastName,
            organizationName: _organizationName,
            ownedDocuments: new uint256[](0)
        });

        emit UserRegistered(msg.sender, _role);
    }

    function registerIssuer(
        OrganizationType _organizationType,
        string memory _licenseNumber
    ) public {
        require(issuers[msg.sender].walletAddress == address(0), "Issuer already registered");
        require(users[msg.sender].role == UserRole.ISSUING_AUTHORITY, "User is not an issuing authority");

        issuers[msg.sender] = Issuer({
            walletAddress: msg.sender,
            organizationType: _organizationType,
            licenseNumber: _licenseNumber,
            issuedDocuments: new uint256[](0)
        });

        emit IssuerRegistered(msg.sender, _organizationType, _licenseNumber);
    }

    function registerVerifier(
        VerifierType _organizationType,
        string memory _licenseNumber
    ) public {
        require(verifiers[msg.sender].walletAddress == address(0), "Verifier already registered");
        require(users[msg.sender].role == UserRole.VERIFYING_AUTHORITY, "User is not a verifying authority");

        verifiers[msg.sender] = Verifier({
            walletAddress: msg.sender,
            organizationType: _organizationType,
            licenseNumber: _licenseNumber
        });

        emit VerifierRegistered(msg.sender, _organizationType, _licenseNumber);
    }

    function issueDocument(
        address _owner,
        DocumentType _docType,
        string memory _title,
        string memory _contentHash
    ) public onlyIssuer {
        documentCount++;

        documents[documentCount] = Document({
            id: documentCount,
            docType: _docType,
            title: _title,
            contentHash: _contentHash,
            issuer: msg.sender,
            owner: _owner,
            status: VerificationStatus.PENDING,
            issuedAt: block.timestamp
        });

        issuers[msg.sender].issuedDocuments.push(documentCount);
        users[_owner].ownedDocuments.push(documentCount);

        emit DocumentIssued(documentCount, msg.sender, _owner);
    }

    function verifyDocument(uint256 _documentId) public onlyVerifier {
        require(documents[_documentId].owner != address(0), "Document does not exist");
        documents[_documentId].status = VerificationStatus.VERIFIED;

        emit DocumentVerified(_documentId, VerificationStatus.VERIFIED);
    }
}