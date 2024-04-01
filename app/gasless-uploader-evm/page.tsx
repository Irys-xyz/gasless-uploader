import React, { FC } from "react";

import GaslessUploader from "../components/GaslessUploader";

const Page: FC = () => {
	return (
		<div className="mx-auto py-10 bg-background text-text flex flex-col-reverse gap-10 md:flex-row justify-center items-start">
			<div className="p-10 w-full md:w-1/3 md:p-0">
				<GaslessUploader showImageView={true} showReceiptView={true} blockchain="EVM" />
			</div>

			<div className="flex flex-col text-xs space-y-1 items-start">
				<h1 className="text-2xl font-bold rounded-xl mb-3">Usage example:</h1>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To hide the image preview:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<GaslessUploader showImageView={ false } />"}</code>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-base text-neutral-700">To hide the receipt preview:</p>
						<code className="rounded bg-[#D8CFCA] px-2 py-1">{"<GaslessUploader showReceiptView={ false } />"}</code>
					</div>
					<div className="gap-2">
						Before testing, set the <span className="bg-gray-200 p-1">PRIVATE_KEY_EVM</span> variable in{" "}
						<span className="bg-gray-200 p-1">.env.local</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
