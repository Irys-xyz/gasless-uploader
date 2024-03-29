import type { NextApiRequest, NextApiResponse } from "next";
import { TypedEthereumSigner } from "arbundles";
import { NextResponse } from "next/server";
import Irys from "@irys/sdk";
import HexInjectedSolanaSigner from "arbundles/build/web/esm/src/signing/chains/HexInjectedSolanaSigner";

/**
 *
 * @returns A signed version of the data, signatureData, as sent by the client.
 */
async function signDataOnServer(signatureData: Buffer): Promise<Buffer> {
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

	const encodedMessage = Buffer.from(signatureData);

	const signature = await serverIrys.tokenConfig.sign(encodedMessage);

	const isValid = await HexInjectedSolanaSigner.verify(
		serverIrys.tokenConfig.getPublicKey() as Buffer,
		signatureData,
		signature,
	);

	return Buffer.from(signature);
}

async function readFromStream(stream: ReadableStream): Promise<string> {
	const reader = stream.getReader();
	let result = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		result += new TextDecoder().decode(value);
	}

	return result;
}

export async function POST(req: Request) {
	//@ts-ignore
	const rawData = await readFromStream(req.body);
	const body = JSON.parse(rawData);

	const signatureData = Buffer.from(body.signatureData, "hex");
	const signature = await signDataOnServer(signatureData);

	return NextResponse.json({ signature: signature.toString("hex") });
}
