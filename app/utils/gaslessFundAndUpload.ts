import { WebIrys } from "@irys/sdk";
import getIrys from "../utils/getIrys";

type Tag = {
	name: string;
	value: string;
};

const gaslessFundAndUploadEVM = async (selectedFile: File, tags: Tag[]): Promise<string> => {
	// obtain the server's public key
	const pubKeyRes = (await (await fetch("/api/publicKeyEVM")).json()) as unknown as {
		pubKey: string;
	};
	const pubKey = Buffer.from(pubKeyRes.pubKey, "hex");
	// Create a provider - this mimics the behaviour of the injected provider, i.e metamask
	const provider = {
		// For EVM wallets
		getPublicKey: async () => {
			return pubKey;
		},
		getSigner: () => {
			return {
				getAddress: () => pubKey.toString(), // pubkey is address for TypedEthereumSigner
				_signTypedData: async (
					_domain: never,
					_types: never,
					message: { address: string; "Transaction hash": Uint8Array },
				) => {
					const convertedMsg = Buffer.from(message["Transaction hash"]).toString("hex");
					console.log("convertedMsg: ", convertedMsg);
					const res = await fetch("/api/signDataEVM", {
						method: "POST",
						body: JSON.stringify({ signatureData: convertedMsg }),
					});
					const { signature } = await res.json();
					const bSig = Buffer.from(signature, "hex");
					// Pad & convert so it's in the format the signer expects to have to convert from.
					const pad = Buffer.concat([Buffer.from([0]), Buffer.from(bSig)]).toString("hex");
					return pad;
				},
			};
		},

		_ready: () => {},
	};
	console.log("Got provider=", provider);
	// You can delete the lazyFund route if you're prefunding all uploads
	// 2. then pass the size to the lazyFund API route
	const fundTx = await fetch("/api/lazyFundEVM", {
		method: "POST",
		body: selectedFile.size.toString(),
	});

	// Create a new WebIrys object using the provider created with server info.
	const network = process.env.NEXT_PUBLIC_NETWORK || "devnet";
	const token = process.env.NEXT_PUBLIC_TOKEN || "";

	const wallet = { name: "ethersv5", provider: provider };
	const irys = new WebIrys({ network, token, wallet });

	const w3signer = await provider.getSigner();
	const address = (await w3signer.getAddress()).toLowerCase();
	await irys.ready();

	console.log("Uploading...");
	const tx = await irys.uploadFile(selectedFile, {
		tags,
	});
	console.log(`Uploaded successfully. https://gateway.irys.xyz/${tx.id}`);

	return tx.id;
};

const gaslessFundAndUploadSOL = async (selectedFile: File, tags: Tag[]): Promise<string> => {
	// Obtain the server's public key
	const pubKeyRes = (await (await fetch("/api/publicKeySOL")).json()) as unknown as {
		pubKey: string;
	};
	const pubKey = Buffer.from(pubKeyRes.pubKey, "hex");
	console.log("got pubKey=", pubKey);
	// Create a provider
	const provider = {
		publicKey: {
			toBuffer: () => pubKey,
			byteLength: 32,
		},
		signMessage: async (message: Uint8Array) => {
			let convertedMsg = Buffer.from(message).toString("hex");
			const res = await fetch("/api/signDataSOL", {
				method: "POST",
				body: JSON.stringify({
					signatureData: convertedMsg,
				}),
			});
			const { signature } = await res.json();
			const bSig = Buffer.from(signature, "hex");
			return bSig;
		},
	};

	// You can delete the lazyFund route if you're prefunding all uploads
	const fundTx = await fetch("/api/lazyFundSOL", {
		method: "POST",
		body: selectedFile.size.toString(),
	});

	// Create a new WebIrys object using the provider created with server info.
	const network = process.env.NEXT_PUBLIC_NETWORK || "devnet";
	const wallet = { rpcUrl: "https://api.devnet.solana.com", name: "solana", provider: provider };
	const irys = new WebIrys({ network, token: "solana", wallet });

	await irys.ready();
	console.log("WebIrys=", irys);

	console.log("Uploading...");
	const tx = await irys.uploadFile(selectedFile, {
		tags,
	});
	console.log(`Uploaded successfully. https://gateway.irys.xyz/${tx.id}`);

	return tx.id;
};

/**
 * Uploads the selected file and tags after funding if necessary.
 *
 * @param {File} selectedFile - The file to be uploaded.
 * @param {Tag[]} tags - An array of tags associated with the file.
 * @returns {Promise<string>} - The transaction ID of the upload.
 */
const gaslessFundAndUpload = async (selectedFile: File, tags: Tag[], blockchain: "EVM" | "SOL"): Promise<string> => {
	let txId = "";
	switch (blockchain) {
		case "EVM":
			txId = await gaslessFundAndUploadEVM(selectedFile, tags);
			break;
		case "SOL":
			txId = await gaslessFundAndUploadSOL(selectedFile, tags);
			break;
		default:
			throw new Error("Unsupported blockchain");
	}
	return txId;
};

export default gaslessFundAndUpload;
