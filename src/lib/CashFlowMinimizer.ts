interface Person {
  id: number;
  name: string;
  balance: number;
}

interface Transaction {
  from: number;
  to: number;
  amount: number;
}

export class CashFlowMinimizer {
  private people: Person[] = [];
  private transactions: Transaction[] = [];

  addPerson(name: string): number {
    const id = this.people.length;
    this.people.push({ id, name, balance: 0 });
    return id;
  }

  addExpense(fromId: number, amount: number, toIds: number[]): void {
    if (toIds.length === 0) return;
    
    // Round the amount to ensure whole numbers in INR
    amount = Math.round(amount);
    const splitAmount = Math.round(amount / toIds.length);
    
    // Update payer's balance (they need to receive money)
    this.people[fromId].balance += amount;
    
    // Update recipients' balances (they need to pay)
    // Handle any rounding errors by adjusting the last person's amount
    let totalSplit = 0;
    toIds.forEach((toId, index) => {
      if (index === toIds.length - 1) {
        // Last person pays the remaining to ensure total equals original amount
        const remaining = amount - totalSplit;
        this.people[toId].balance -= remaining;
      } else {
        this.people[toId].balance -= splitAmount;
        totalSplit += splitAmount;
      }
    });
  }

  private getMinMaxBalances(): [number, number] {
    let minId = -1;
    let maxId = -1;
    let minBalance = 0;
    let maxBalance = 0;
    
    // Find the person who needs to pay the most (most negative balance)
    // and the person who needs to receive the most (most positive balance)
    for (let i = 0; i < this.people.length; i++) {
      const balance = Math.round(this.people[i].balance); // Round to ensure whole numbers
      
      if (balance < -0.01) { // Using small threshold to handle floating-point errors
        if (minId === -1 || balance < minBalance) {
          minId = i;
          minBalance = balance;
        }
      }
      if (balance > 0.01) { // Using small threshold to handle floating-point errors
        if (maxId === -1 || balance > maxBalance) {
          maxId = i;
          maxBalance = balance;
        }
      }
    }
    
    return [minId, maxId];
  }

  minimizeCashFlow(): Transaction[] {
    this.transactions = [];
    // Create a copy of balances and round them to ensure whole numbers
    const balances = this.people.map(p => Math.round(p.balance));
    
    while (true) {
      const [minId, maxId] = this.getMinMaxBalances();
      
      // If no more transactions are needed, break
      if (minId === -1 || maxId === -1) break;
      
      // Calculate the amount to transfer (use absolute value for negative balance)
      const amount = Math.min(Math.abs(balances[minId]), balances[maxId]);
      
      if (amount < 1) break; // Stop if amount is too small (less than 1 rupee)
      
      // Update balances
      balances[maxId] -= amount;
      balances[minId] += amount;
      
      // Update the actual people's balances
      this.people[maxId].balance = balances[maxId];
      this.people[minId].balance = balances[minId];
      
      // Record the transaction
      this.transactions.push({
        from: minId,
        to: maxId,
        amount: amount
      });
    }
    
    return this.transactions;
  }

  getPeople(): Person[] {
    return this.people.map(p => ({
      ...p,
      balance: Math.round(p.balance) // Ensure whole numbers when returning people
    }));
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  reset(): void {
    this.people = [];
    this.transactions = [];
  }
}