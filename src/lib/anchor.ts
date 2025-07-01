import { AnchorProvider, Program, setProvider, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "../idl/certify.json";
import { Certificate, CertificateAccount } from "./types";

export const getProgram = async (wallet: any) => {
  const connection = new Connection("http://127.0.0.1:8898", "processed");

  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  setProvider(provider);

  const program = new Program(idl as Idl, provider);

  return { program, provider, connection };
};

export const getCertificatePDA = (certificateId: string) => {
  const programId = new PublicKey(idl.address);
  const [certificatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("cert"), Buffer.from(certificateId)],
    programId,
  );
  return certificatePDA;
};

export type { Certificate, CertificateAccount };
