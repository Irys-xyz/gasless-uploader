import { TypedEthereumSigner } from "arbundles";
import { NextResponse } from "next/server";
import Irys from "@irys/sdk";

/**
 * @returns The server's public key.
 */
async function serverInit(): Promise<Buffer> {
	const key = process.env.PRIVATE_KEY_SOL;
	const token = "solana";
	const url = process.env.NEXT_PUBLIC_NODE || "";
	// Change if deploying on mainnet
	const providerUrl = "https://api.devnet.solana.com";
	const serverIrys = new Irys({
		url, // URL of the node you want to connect to
		token, // Token used for payment and signing
		key: key,
		config: { providerUrl }, // Only required when using Devnet
	});
	const publicKey = serverIrys.tokenConfig.getSigner().publicKey;
	return publicKey;
}

export async function GET(req: Request) {
	return NextResponse.json({ pubKey: (await serverInit()).toString("hex") });
}
