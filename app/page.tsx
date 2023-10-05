import Image from "next/image";

export default function Home() {
	return (
		<div className="py-10 bg-background text-text flex flex-col justify-center items-center p-8">
			<div className="text-2xl font-semibold mt-10 leading-relaxed max-w-3xl">
				<a
					href="http://docs.irys.xyz/developer-docs/provenance-toolkit"
					target="_blank"
					className="text-blue-500 hover:text-blue-700 underline"
				>
					The Irys Gassless uploader
				</a>{" "}
				is a set of UI components to help kickstart your next project.
			</div>
			<div className="text-xl mb-6 leading-relaxed max-w-3xl mt-5">
				To build with the toolkit, clone or fork{" "}
				<a
					href="https://github.com/Bundlr-Network/provenance-toolkit"
					target="_blank"
					className="text-blue-500 hover:text-blue-700 underline"
				>
					the repository
				</a>{" "}
				and use the components to build your project.
				<span>The toolkit contains the following components.</span>
				<ul className="list-disc mt-4 ml-4">
					<li>
						Fund / Withdraw:<span className=""> Manages node balances.</span>
					</li>
					<li>
						Uploader:<span className=""> Upload single files or groups of files.</span>
					</li>
					<li>
						Progress Bar Uploader:
						<span className=""> Upload large files, and provide feedback with a progress bar.</span>
					</li>
					<li>
						UDL Uploader:<span className=""> Upload files and attach a UDL.</span>
					</li>
					<li>
						Gasless Uploader:<span className=""> Pay for user uploads server-side.</span>
					</li>
					<li>
						Transaction Feed:
						<span className=""> Query Irys transactions.</span>
					</li>
				</ul>
			</div>
		</div>
	);
} // Home
