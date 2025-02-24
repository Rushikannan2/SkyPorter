type Matrix = number[][];
type Vector = number[];

interface LuggageConstraint {
    maxWeight: number;
    maxPieces: number;
    basePrice: number;
}

export class SimplexSolver {
    private tableau: Matrix;
    private numVars: number;
    private numConstraints: number;

    constructor(
        private weights: number[],      // weights of each piece
        private values: number[],       // importance/priority of each piece
        private constraint: LuggageConstraint
    ) {
        this.numVars = weights.length;
        this.numConstraints = 2;  // weight and piece constraints
        
        // Setup the optimization problem
        const objective = this.values;
        const constraints = [
            this.weights,                              // weight constraint
            Array(this.weights.length).fill(1)         // pieces constraint
        ];
        const b = [constraint.maxWeight, constraint.maxPieces];
        
        this.tableau = this.createTableau(objective, constraints, b, true);
    }

    private createTableau(
        objective: Vector,
        constraints: Matrix,
        b: Vector,
        isMaximization: boolean
    ): Matrix {
        const m = constraints.length;
        const n = constraints[0].length;
        
        const tableau: Matrix = Array(m + 1).fill(0).map(() => 
            Array(n + m + 1).fill(0)
        );

        // Fill objective row (multiply by -1 if maximization)
        const multiplier = isMaximization ? -1 : 1;
        for (let j = 0; j < n; j++) {
            tableau[0][j] = multiplier * objective[j];
        }

        // Fill constraints
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                tableau[i + 1][j] = constraints[i][j];
            }
            tableau[i + 1][n + i] = 1;  // slack variables
            tableau[i + 1][n + m] = b[i];  // right-hand side
        }

        return tableau;
    }

    public solve(): {
        selectedPieces: boolean[];
        totalWeight: number;
        totalValue: number;
        totalPieces: number;
        excessCharge: number;
    } {
        while (this.canImprove()) {
            const pivotColumn = this.findPivotColumn();
            const pivotRow = this.findPivotRow(pivotColumn);
            
            if (pivotRow === -1) {
                throw new Error("Problem is unbounded");
            }
            
            this.pivot(pivotRow, pivotColumn);
        }

        const solution = this.extractSolution();
        const selectedPieces = solution.solution.map(x => x > 0.5);  // binary decision
        const totalWeight = this.weights.reduce((sum, w, i) => 
            sum + (selectedPieces[i] ? w : 0), 0
        );
        const totalValue = this.values.reduce((sum, v, i) => 
            sum + (selectedPieces[i] ? v : 0), 0
        );
        const totalPieces = selectedPieces.filter(x => x).length;

        // Calculate excess charge if any
        const excessWeight = Math.max(0, totalWeight - this.constraint.maxWeight);
        const excessCharge = excessWeight * 25;  // $25 per kg excess

        return {
            selectedPieces,
            totalWeight,
            totalValue,
            totalPieces,
            excessCharge
        };
    }

    private canImprove(): boolean {
        return this.tableau[0].slice(0, this.numVars).some(x => x < 0);
    }

    private findPivotColumn(): number {
        return this.tableau[0]
            .slice(0, this.numVars)
            .findIndex(x => x < 0);
    }

    private findPivotRow(pivotColumn: number): number {
        let minRatio = Infinity;
        let pivotRow = -1;

        for (let i = 1; i <= this.numConstraints; i++) {
            if (this.tableau[i][pivotColumn] <= 0) continue;
            
            const ratio = this.tableau[i][this.tableau[0].length - 1] / 
                         this.tableau[i][pivotColumn];
            
            if (ratio < minRatio) {
                minRatio = ratio;
                pivotRow = i;
            }
        }

        return pivotRow;
    }

    private pivot(pivotRow: number, pivotColumn: number) {
        const pivotValue = this.tableau[pivotRow][pivotColumn];

        for (let j = 0; j < this.tableau[0].length; j++) {
            this.tableau[pivotRow][j] /= pivotValue;
        }

        for (let i = 0; i < this.tableau.length; i++) {
            if (i === pivotRow) continue;
            
            const factor = this.tableau[i][pivotColumn];
            for (let j = 0; j < this.tableau[0].length; j++) {
                this.tableau[i][j] -= factor * this.tableau[pivotRow][j];
            }
        }
    }

    private extractSolution(): { solution: Vector; optimalValue: number } {
        const solution: Vector = Array(this.numVars).fill(0);
        
        for (let j = 0; j < this.numVars; j++) {
            let hasOne = false;
            let row = -1;
            
            for (let i = 1; i <= this.numConstraints; i++) {
                if (this.tableau[i][j] === 1) {
                    if (!hasOne) {
                        hasOne = true;
                        row = i;
                    } else {
                        hasOne = false;
                        break;
                    }
                } else if (this.tableau[i][j] !== 0) {
                    hasOne = false;
                    break;
                }
            }
            
            if (hasOne) {
                solution[j] = this.tableau[row][this.tableau[0].length - 1];
            }
        }

        return {
            solution,
            optimalValue: -this.tableau[0][this.tableau[0].length - 1]
        };
    }
} 