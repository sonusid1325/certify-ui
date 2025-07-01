import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export interface CertifyProgram {
  version: "0.1.0";
  name: "certify";
  instructions: [
    {
      name: "issueCertificate";
      accounts: [
        {
          name: "certificate";
          isMut: true;
          isSigner: false;
        },
        {
          name: "issuer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "student";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "certificateId";
          type: "string";
        },
        {
          name: "course";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "certificate";
      type: {
        kind: "struct";
        fields: [
          {
            name: "student";
            type: "publicKey";
          },
          {
            name: "issuer";
            type: "publicKey";
          },
          {
            name: "certificateId";
            type: "string";
          },
          {
            name: "course";
            type: "string";
          },
          {
            name: "issuedAt";
            type: "i64";
          }
        ];
      };
    }
  ];
}

export interface CertificateAccount {
  student: PublicKey;
  issuer: PublicKey;
  certificateId: string;
  course: string;
  issuedAt: BN;
}

export interface Certificate {
  student: PublicKey;
  issuer: PublicKey;
  certificateId: string;
  course: string;
  issuedAt: number;
}
