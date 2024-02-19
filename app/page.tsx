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
				is a set of two UI components for doing gasless file uploads
			</div>
		</div>
	);
} // Home
