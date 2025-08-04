import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
  isEditing: boolean;
  isGoalFulfilled?: boolean;
};

export const TierCard: React.FC<TierCardProps> = ({
  tier,
  index,
  contract,
  isEditing,
  isGoalFulfilled = false,
}) => {
  return (
    <div className="w-full h-[200px] p-6 rounded-2xl bg-gradient-to-br from-black via-black to-blue-950/30 border border-blue-500/30 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
      <div className="h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
              ${Number(tier.amount.toString()).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-400">
              {tier.backers.toString()} Backers
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {!isEditing ? (
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: contract,
                  method: "function fund(uint256 _tierIndex) payable",
                  params: [BigInt(index)],
                  value: tier.amount,
                })
              }
              onError={(error) => alert(`Error: ${error.message}`)}
              onTransactionConfirmed={() => alert("Funded successfully!")}
              className={`w-full px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                isGoalFulfilled
                  ? "bg-gray-600 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              }`}
              disabled={isGoalFulfilled}
            >
              {isGoalFulfilled ? (
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                  </svg>
                  Goal Fulfilled
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  Select Tier
                </div>
              )}
            </TransactionButton>
          ) : (
            <TransactionButton
              transaction={() =>
                prepareContractCall({
                  contract: contract,
                  method: "function removeTier(uint256 _index)",
                  params: [BigInt(index)],
                })
              }
              onError={(error) => alert(`Error: ${error.message}`)}
              onTransactionConfirmed={() => alert("Removed successfully!")}
              className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 text-sm font-medium"
            >
              <div className="flex items-center justify-center gap-2">
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
                Remove
              </div>
            </TransactionButton>
          )}
        </div>
      </div>
    </div>
  );
};