import Irys from "@irys/sdk";
import getRpcUrl from "@/app/utils/getRpcUrl";
import { NextResponse } from "next/server";
import { ReadableStream } from "stream/web";

/**
 * Given a file of the specified size, get the cost to upload, then fund a node that amount
 * @param filesize The size of a file to fund for
 * @returns
 */
async function lazyFund(filesize: string): Promise<string> {
	console.log("lazyFund SOL");

	const key = process.env.PRIVATE_KEY_SOL;
	const token = "solana";
	const network = process.env.NEXT_PUBLIC_NETWORK || "devnet";
	// Change if deploying on Mainnet
	const providerUrl = "https://api.devnet.solana.com";

	const serverIrys = new Irys({
		network, // "mainnet" || "devnet"
		token, // Token used for payment and signing
		key,
		config: { providerUrl }, // Only required when using Devnet
	});

	const price = await serverIrys.getPrice(parseInt(filesize));
	console.log("lazyFund SOL price=", price);

	const balance = await serverIrys.getLoadedBalance();
	console.log("lazyFund SOL balance=", balance);

	let fundTx;
	if (price.isGreaterThanOrEqualTo(balance)) {
		console.log("Funding node.");
		fundTx = await serverIrys.fund(price);
		console.log("Successfully funded fundTx=", fundTx);
	} else {
		console.log("Funding not needed, balance sufficient.");
	}

	// return the transaction id
	return fundTx?.id || "";
}

async function readFromStream(stream: ReadableStream<Uint8Array> | null): Promise<string> {
	if (!stream) return "";
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
	const rawData = await readFromStream(req.body as ReadableStream<Uint8Array> | null);

	const body = JSON.parse(rawData);
	const fundTx = await lazyFund(body);

	return NextResponse.json({ txResult: fundTx });
}
