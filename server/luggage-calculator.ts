export enum TravelClass {
    ECONOMY = 'ECONOMY',
    BUSINESS = 'BUSINESS',
    FIRST = 'FIRST'
}

interface WeightLimit {
    standardLimit: number;
    basePrice: number;
    excessChargePerKg: number;
    maxPieces: number;
}

export class LuggageCalculator {
    private weightLimits: Record<TravelClass, WeightLimit> = {
        [TravelClass.ECONOMY]: {
            standardLimit: 20,
            basePrice: 10000,
            excessChargePerKg: 1500,
            maxPieces: 2
        },
        [TravelClass.BUSINESS]: {
            standardLimit: 30,
            basePrice: 25000,
            excessChargePerKg: 1750,
            maxPieces: 2
        },
        [TravelClass.FIRST]: {
            standardLimit: 40,
            basePrice: 45000,
            excessChargePerKg: 2000,
            maxPieces: 3
        }
    };

    calculateFare(
        luggageWeight: number,
        travelClass: TravelClass
    ) {
        const classLimit = this.weightLimits[travelClass];
        const limit = classLimit.standardLimit;
        
        // Calculate base fare based on travel class
        const baseFare = classLimit.basePrice;
        let totalFare = baseFare;
        let message = '';
        let excessWeightCharge = 0;

        // Check if luggage weight exceeds class limit
        if (luggageWeight > limit) {
            const excessWeight = luggageWeight - limit;
            excessWeightCharge = excessWeight * classLimit.excessChargePerKg;
            totalFare += excessWeightCharge;
            message = `Warning: Luggage weight (${luggageWeight}kg) exceeds ${travelClass} class limit of ${limit}kg. 
                      Extra charge of ₹${excessWeightCharge.toLocaleString('en-IN')} applies.`;
        } else {
            message = `Luggage weight (${luggageWeight}kg) is within ${travelClass} class limit of ${limit}kg. No extra charges.`;
        }

        // Weight limit message based on travel class
        const weightLimitMessage = `Maximum allowed weight for ${travelClass} class is ${limit}kg`;

        return {
            travelClass,
            luggageWeight,
            weightLimit: limit,
            isExcess: luggageWeight > limit,
            excessWeight: Math.max(0, luggageWeight - limit),
            baseFare,
            excessCharge: excessWeightCharge,
            totalFare,
            message,
            weightLimitMessage,
            breakdown: {
                baseFare: this.formatCurrency(baseFare),
                excessCharge: this.formatCurrency(excessWeightCharge),
                totalFare: this.formatCurrency(totalFare)
            }
        };
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }
}