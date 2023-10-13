export const formatIpfsLink = (url) => {
		if (!url || !url.includes("ipfs://")) return url;
		return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
	};
