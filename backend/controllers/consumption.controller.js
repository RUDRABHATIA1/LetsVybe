import User from '../models/user.model.js';

// Helper to determine if a date is today
const isSameDay = (date1, date2) => {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
           date1.getUTCMonth() === date2.getUTCMonth() &&
           date1.getUTCDate() === date2.getUTCDate();
};

export const pingConsumption = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();
        const tracking = user.contentTracking || {
            baseLimit: 30,
            consumedToday: 0,
            lastUpdated: now,
            activeLoan: { type: 'none', penaltyDaysRemaining: 0, loanTakenDate: null }
        };

        const lastUpdated = new Date(tracking.lastUpdated || Date.now());

        if (!isSameDay(lastUpdated, now)) {
            tracking.consumedToday = 0;
            // daily reset logic
            if (tracking.activeLoan && tracking.activeLoan.penaltyDaysRemaining > 0) {
                tracking.activeLoan.penaltyDaysRemaining -= 1;
                if (tracking.activeLoan.penaltyDaysRemaining === 0) {
                    tracking.activeLoan.type = 'none'; // penalty over
                }
            } else if (tracking.activeLoan) {
                 tracking.activeLoan.type = 'none'; 
            }
        }

        // Add 1 minute to consumed time
        tracking.consumedToday += 1;
        tracking.lastUpdated = now;
        user.contentTracking = tracking;
        await user.save();

        // Calculate effective limit for today
        let limit = tracking.baseLimit;
        
        if (tracking.activeLoan && tracking.activeLoan.type !== 'none') {
            const loanDate = tracking.activeLoan.loanTakenDate ? new Date(tracking.activeLoan.loanTakenDate) : null;
            if (loanDate && isSameDay(loanDate, now)) {
                // Today is the day the loan was taken. Add the loan amount.
                limit += tracking.activeLoan.type === '5min' ? 5 : 10;
            } else {
                // We are in the penalty period. Deduct the loan amount.
                limit -= tracking.activeLoan.type === '5min' ? 5 : 10;
            }
        }

        const isLimitReached = tracking.consumedToday >= limit;

        return res.status(200).json({
            consumedToday: tracking.consumedToday,
            limit: limit,
            isLimitReached: isLimitReached,
            timeLeft: Math.max(0, limit - tracking.consumedToday),
            activeLoan: tracking.activeLoan
        });

    } catch (error) {
        console.error("Error in pingConsumption: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const takeLoan = async (req, res) => {
    try {
        const userId = req.userId;
        const { loanType } = req.body;

        if (loanType !== '5min' && loanType !== '10min') {
            return res.status(400).json({ message: "Invalid loan type" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();
        const tracking = user.contentTracking || {
            baseLimit: 30,
            consumedToday: 0,
            lastUpdated: now,
            activeLoan: { type: 'none', penaltyDaysRemaining: 0, loanTakenDate: null }
        };

        if (tracking.activeLoan && (tracking.activeLoan.type !== 'none' || tracking.activeLoan.penaltyDaysRemaining > 0)) {
            return res.status(400).json({ message: "You already have an active loan or penalty." });
        }

        if (!tracking.activeLoan) {
             tracking.activeLoan = {};
        }

        tracking.activeLoan.type = loanType;
        tracking.activeLoan.penaltyDaysRemaining = loanType === '5min' ? 5 : 10;
        tracking.activeLoan.loanTakenDate = now;
        
        // ensure lastUpdated is fresh so the ping logic sees it properly
        tracking.lastUpdated = now;
        user.contentTracking = tracking;
        await user.save();

        let limit = tracking.baseLimit + (loanType === '5min' ? 5 : 10);
        const isLimitReached = tracking.consumedToday >= limit;

        return res.status(200).json({
            message: `Successfully took a ${loanType} loan.`,
            consumedToday: tracking.consumedToday,
            limit: limit,
            isLimitReached: isLimitReached,
            timeLeft: Math.max(0, limit - tracking.consumedToday),
            activeLoan: tracking.activeLoan
        });

    } catch (error) {
        console.error("Error in takeLoan: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
