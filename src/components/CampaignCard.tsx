"use client";

import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type CampaignCardProps = {
  campaignAddress: string;
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaignAddress }) => {
  const contract = getContract({
    client,
    chain: sepolia,
    address: campaignAddress,
  });

  const { data: campaignName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: goal } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: balance } = useReadContract({
    contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  const totalBalance = balance?.toString() || "0";
  const totalGoal = goal?.toString() || "1";
  let balancePercentage = (parseInt(totalBalance) / parseInt(totalGoal)) * 100;
  if (balancePercentage >= 100) balancePercentage = 100;
  return (
    <div className="w-full h-[280px] flex flex-col justify-between p-4 sm:p-6 rounded-2xl shadow-md transition-all duration-300 bg-gradient-to-br from-black via-black to-blue-800 border border-blue-700/30 hover:shadow-blue-500/40">
      <div>
        <div className="relative w-full h-5 bg-blue-200/10 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-blue-500 text-right rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${balancePercentage}%` }}
          >
            <p className="text-[10px] text-white px-2">
              ${parseInt(totalBalance).toLocaleString()}
            </p>
          </div>
          <p className="absolute top-0 right-1 text-[10px] text-white font-light">
            {balancePercentage < 100 ? `${balancePercentage.toFixed(0)}%` : ""}
          </p>
        </div>

        <div className="space-y-2">
          <h5 className="text-lg font-semibold text-white">
            {campaignName || "Loading..."}
          </h5>
          <p className="text-sm text-blue-100 line-clamp-3 min-h-[3rem]">
            {campaignDescription || "No description available."}
          </p>
        </div>
      </div>

      <Link 
        href={`/campaign/${campaignAddress}`} 
        className="w-full mt-auto"
        passHref
      >
        <p className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-blue-400/40">
          View Campaign
          <svg
            className="w-4 h-4 ml-2 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 14 10"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </p>
      </Link>
    </div>
  );
};
