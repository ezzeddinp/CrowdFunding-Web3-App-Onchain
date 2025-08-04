import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type MyCampaignCardProps = {
  contractAddress: string;
};

export const MyCampaignCard: React.FC<MyCampaignCardProps> = ({
  contractAddress,
}) => {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: contractAddress,
  });

  // Get Campaign Name
  const { data: name } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: balance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const totalBalanceGathered = balance?.toString();
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 bg-gradient-to-br from-black via-black to-blue-900 border-2 border-blue-500/50 hover:shadow-blue-500/40 relative overflow-hidden">
      {/* Owner Badge */}
      <div className="absolute -right-12 top-7 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs py-1 px-12 rotate-45 shadow-lg">
        Owner
      </div>

      <div className="flex flex-col justify-between">
        <div className="flex flex-col h-[120px]">
          <h5 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
            {name || "Loading..."}
          </h5>
          <p className="text-[12px] flex-1 text-blue-100/80 line-clamp-3 min-h-[3rem]">
            {description || "No description available."}
          </p>
        </div>

        {/* Raised Amount Card */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="p-3 flex flex-col rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
            <p className="text-xs text-blue-200 mb-1">Total Raised</p>
            <p className="text-xl font-bold text-blue-100">
              ${parseInt(totalBalanceGathered as string).toLocaleString()}
            </p>
          </div>
          <Link
            href={`/campaign/${contractAddress}`}
            className="w-full mt-auto"
            passHref
          >
            <p className="w-full inline-flex items-center justify-center px-4 py-2 text-[12px] font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
              Manage Campaign
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
              </svg>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
