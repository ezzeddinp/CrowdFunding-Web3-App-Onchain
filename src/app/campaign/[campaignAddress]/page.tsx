"use client";
import { client } from "@/app/client";
import { TierCard } from "@/components/TierCard";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getContract, prepareContractCall, ThirdwebContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import {
  lightTheme,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";

export default function CampaignPage() {
  const account = useActiveAccount();
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tierName, setTierName] = useState<string>("");
  const [tierAmount, setTierAmount] = useState<bigint>(1n);
  const [formattedAmount, setFormattedAmount] = useState<string>("");

  const formatWithDots = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, ""); // remove dots
    if (/^\d*$/.test(raw)) {
      setFormattedAmount(formatWithDots(raw));
      setTierAmount(BigInt(raw || "0"));
    }
  };

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: campaignAddress as string,
  });

  // Name of the campaign
  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  // Description of the campaign
  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  // Campaign deadline
  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract: contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });
  // Convert deadline to a date
  const deadlineDate = new Date(
    parseInt(deadline?.toString() as string) * 1000
  );
  // Check if deadline has passed
  const hasDeadlinePassed = deadlineDate < new Date();

  // Goal amount of the campaign
  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  // Total funded balance of the campaign
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  // Calulate the total funded balance percentage
  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  // If balance is greater than or equal to goal, percentage should be 100
  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

    const isGoalFulfilled = balancePercentage >= 100;

  // Get tiers for the campaign
  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract: contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  // Get owner of the campaign
  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  // Get status of the campaign
  const { data: status } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-blue-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          {name}
        </h1>
        {owner === account?.address && (
          <div className="flex gap-3">
            {isEditing && (
              <span className="px-4 py-2 bg-black/40 border border-blue-500/30 text-sm rounded-xl text-blue-400">
                Status:{" "}
                {status === 0
                  ? "Active"
                  : status === 1
                  ? "Successful"
                  : "Failed"}
              </span>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="lg:max-w-5xl grid grid-rows-1 lg:grid-rows-2 gap-8">
        {/* Left Column - Campaign Info */}
        <div className="lg:row-span-1 space-y-6">
          {/* Description Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-md font-semibold text-white mb-3">
              Description
            </h2>
            <p className="text-blue-100/80 leading-relaxed">{description}</p>
          </div>
          {/* Progress Card */}
         
          {/* Progress Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-blue-500/30 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md font-semibold text-white">
                Campaign Progress
              </h2>
              <span className="text-sm text-blue-400">
                Deadline: {deadlineDate.toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-blue-400 text-sm">Raised</p>
                  <p className="text-2xl font-bold text-white">
                    ${parseInt(totalBalance as string).toLocaleString()}
                    <span className="text-sm text-blue-400 ml-1">
                      / ${parseInt(totalGoal as string).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
                    {balancePercentage === 0
                      ? "0"
                      : Math.floor(balancePercentage)}
                    %
                  </span>
                </div>
              </div>

              <div className="relative w-full h-3 bg-blue-950/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 transition-all duration-500 ease-out relative"
                  style={{ width: `${balancePercentage}%` }}
                >
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                  <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm lg:place-items-center lg:px-10">
                <div className="p-3 rounded-xl text-center bg-blue-500/10 border border-blue-500/20 lg:w-full">
                  <p className="text-blue-400 mb-1 lg:font-semibold lg:text-md">Current Balance</p>
                  <p className="text-white font-medium">
                    ${parseInt(totalBalance as string).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl text-center bg-blue-500/10 border border-blue-500/20 lg:w-full">
                  <p className="text-blue-400 mb-1 lg:font-semibold lg:text-md">Campaign Goal</p>
                  <p className="text-white font-medium">
                    ${parseInt(totalGoal as string).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
      
        </div>

        {/* Right Column - Tiers */}
        <div className="lg:row-span-1">
          <div className="sticky top-4">
            <h2 className="text-md font-semibold text-white mb-4">
              Funding Tiers
            </h2>
            <div className="w-full px-0">
              <div className="grid place-items-center md:place-items-start grid-cols-1 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiers && tiers.length > 0
                  ? tiers.map((tier, index) => (
                      <div key={index} className="w-full h-full">
                        <TierCard
                          tier={tier}
                          index={index}
                          contract={contract}
                          isEditing={isEditing}
                          isGoalFulfilled={isGoalFulfilled}
                        />
                      </div>
                    ))
                  : !isEditing && (
                      <p className="text-blue-400/60">No tiers available</p>
                    )}

                {isEditing &&
                  ((tiers?.length ?? 0) < 3 ? (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full h-full p-4 rounded-xl border-2 border-dashed border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:bg-blue-500/10"
                    >
                      + Add New Tier
                    </button>
                  ) : (
                    <div className="w-full h-full p-4 rounded-xl border-2 border-dashed border-red-500/30 text-red-400 bg-red-500/10 text-center">
                      You&apos;ve reached the maximum of 3 funding tiers.
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-gradient-to-b from-blue-950 via-black to-black p-6 rounded-2xl border border-blue-500/30 shadow-xl shadow-blue-500/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                Create Funding Tier
              </h3>
              <button
                aria-label="close modal"
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2">
                  Tier Name
                </label>
                <input
                  type="text"
                  value={tierName}
                  onChange={(e) => setTierName(e.target.value)}
                  className="w-full px-4 py-2 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter tier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-400 mb-2">
                  Amount (ETH)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formattedAmount}
                  onChange={handleFormattedChange}
                  className="w-full px-4 py-2 bg-black/50 border border-blue-500/30 rounded-xl text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter amount"
                />
              </div>

              <TransactionButton
                transaction={() =>
                  prepareContractCall({
                    contract,
                    method: "function addTier(string _name, uint256 _amount)",
                    params: [tierName, tierAmount],
                  })
                }
                onTransactionConfirmed={() => {
                  alert("Tier added successfully!");
                  setIsModalOpen(false);
                }}
                onError={(error) => alert(`Error: ${error.message}`)}
                theme={lightTheme()}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                Create Tier
              </TransactionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
  tiers: any[];
};
