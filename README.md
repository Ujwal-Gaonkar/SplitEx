# SplitEx - Expense Management Using Graph Theory

SplitEx is an innovative expense management tool that leverages graph theory to simplify and optimize the process of splitting expenses among a group of people. By representing individuals and their debts as a graph, SplitEx can efficiently minimize the number of transactions required to settle all debts.

## How It Works

1. **Graph Representation**: Each person is represented as a node in the graph. An edge between two nodes indicates a debt, with the edge weight representing the amount owed.

2. **Debt Simplification**: The algorithm processes the graph to find the optimal way to settle debts with the fewest transactions. This involves identifying cycles and paths in the graph where debts can be offset.

3. **Transaction Minimization**: By consolidating multiple debts into fewer transactions, SplitEx reduces the complexity and number of payments needed to settle all debts.

## Example

Consider a group of four friends: Alice, Bob, Charlie, and Dave. They have the following debts:

- Alice owes Bob $10
- Bob owes Charlie $5
- Charlie owes Dave $7
- Dave owes Alice $8

### Initial Graph

```
Alice --($10)--> Bob
Bob --($5)--> Charlie
Charlie --($7)--> Dave
Dave --($8)--> Alice
```

### Simplified Transactions

1. Alice pays Bob $10.
2. Bob pays Charlie $5.
3. Charlie pays Dave $7.
4. Dave pays Alice $8.

### Optimized Transactions

Using SplitEx, the debts can be simplified:

1. Alice pays Dave $2.
2. Bob pays Dave $3.

This results in fewer transactions and simplifies the process of settling debts.

## Conclusion

SplitEx uses graph theory to provide an efficient and effective way to manage and settle group expenses. By minimizing the number of transactions, it makes the process of splitting expenses easier and more transparent.
