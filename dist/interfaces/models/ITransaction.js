export var TransactionType;
(function (TransactionType) {
    TransactionType["OpenPosition"] = "OpenPosition";
    TransactionType["TopUpPosition"] = "TopUpPosition";
    TransactionType["TopUpPositionAndBorrow"] = "TopUpPositionAndBorrow";
    TransactionType["RepayPosition"] = "RepayPosition";
    TransactionType["Approve"] = "Approve";
    TransactionType["CreateProposal"] = "CreateProposal";
    TransactionType["ExecuteProposal"] = "ExecuteProposal";
    TransactionType["QueueProposal"] = "QueueProposal";
    TransactionType["CastVote"] = "CastVote";
    TransactionType["SwapTokenToStableCoin"] = "SwapTokenToStableCoin";
    TransactionType["SwapStableCoinToToken"] = "SwapStableCoinToToken";
    TransactionType["AddLiquidity"] = "AddLiquidity";
    TransactionType["RemoveLiquidity"] = "RemoveLiquidity";
    TransactionType["ClaimFeesRewards"] = "ClaimFeesRewards";
    TransactionType["WithdrawClaimedFees"] = "WithdrawClaimedFees";
    TransactionType["CreateLock"] = "CreateLock";
    TransactionType["HandleUnlock"] = "HandleUnlock";
    TransactionType["HandleEarlyWithdrawal"] = "HandleEarlyWithdrawal";
    TransactionType["HandleClaimRewards"] = "HandleClaimRewards";
    TransactionType["HandleWithdrawAll"] = "HandleWithdrawAll";
})(TransactionType || (TransactionType = {}));
export var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["None"] = 0] = "None";
    TransactionStatus[TransactionStatus["Success"] = 1] = "Success";
    TransactionStatus[TransactionStatus["Error"] = 2] = "Error";
})(TransactionStatus || (TransactionStatus = {}));
//# sourceMappingURL=ITransaction.js.map