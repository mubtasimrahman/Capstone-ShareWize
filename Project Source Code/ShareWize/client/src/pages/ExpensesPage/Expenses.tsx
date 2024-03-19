import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../App/store/store";
import "./Expenses.css";

interface Expense {
  ExpenseMakerUserId: number;
  ExpenseMakerDisplayName: string;
  ExpenseMakerEmail: string;
  ExpenseId: string;
  Description: string;
  Amount: number;
  DatePaid: Date;
  GroupName: string;
  OtherMemberDisplayNames: string[];
  OtherMemberEmails: string[];
  OtherMemberUserIds: number[];
}
interface SettlementInfo {
  ExpenseId: string;
  ExpenseSplitId: string;
  SettlementStatus: string;
  SettlementAmount: number;
  SettlementDate: Date;
  ExpenseMakerUserId: number; // Add ExpenseMakerUserId to the interface
}

interface UserObject {
  UserId: number;
  GoogleId: string;
  DisplayName: string;
  Email: string;
}

interface ExpenseSplit {
  ExpenseId: string;
  Percentage: string | number;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseSplit, setExpenseSplit] = useState<ExpenseSplit[][]>([]);
  const googleId = useSelector((state: RootState) => state.auth.user?.sub);
  const [currentUser, setCurrentUser] = useState<UserObject | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchAttempted, setFetchAttempted] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("Date");
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [settlementAmount, setSettlementAmount] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [settlementInfo, setSettlementInfo] = useState<SettlementInfo[]>([]);

  const generateUserListItems = (
    userIds: number[],
    displayNames: string[],
    emails: string[],
    currentUser: UserObject | undefined
  ): JSX.Element[] => {
    const userListItems: JSX.Element[] = [];

    // Iterate through the user data arrays
    for (let i = 0; i < displayNames.length; i++) {
      const userId = userIds[i];
      const displayName = displayNames[i];
      const email = emails[i];
      // Check if the current member is not the currently logged-in user and not the expense maker
      if (
        displayName !== currentUser?.DisplayName &&
        email !== currentUser?.Email &&
        userId !== currentUser?.UserId
      ) {
        userListItems.push(
          <li key={userId}>
            {displayName} - {email} -{userId}
          </li>
        );
      }
    }

    return userListItems;
  };
  const handleSettleExpense = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/settleExpense",
        {
          expenseId: selectedExpense?.ExpenseId,
          amount: settlementAmount,
          // payeeEmail: email,
          payerUserId: currentUser?.UserId,
          payeeUserId: selectedUserId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );



      // Handle success
      console.log("Expense settled successfully:", response.data);
    } catch (error: any) {
      // Specify the type as 'any'
      // Log detailed error information
      console.error("Error settling expense:");

      // Handle specific error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Request setup error:", error.message);
      }
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get<UserObject>(
        `http://localhost:8000/getUser/${googleId}`
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    if (googleId) {
      fetchUser();
    } else {
      console.log("Error: googleId is undefined");
    }
  }, [googleId]);

  useEffect(() => {
    if (currentUser) {
      handleFetchExpenses();
    }
  }, [currentUser]);

  const handleFetchExpenses = async () => {
    setLoading(true);
    setFetchAttempted(true);
    try {
      const response = await axios.get<Expense[]>(
        `http://localhost:8000/users/${currentUser!.UserId}/expenses`
      );
      console.log(response);
      const formattedExpenses = response.data.map((expense) => ({
        ...expense,
        DatePaid: new Date(expense.DatePaid), // Assuming server sends UTC dates
      }));
      console.log(formattedExpenses);

      setExpenses(formattedExpenses);

      // Batch expense split requests
      const batchSize = 12; // Define the batch size
      const expenseSplitData: ExpenseSplit[][] = [];
      const settlementInfoData: SettlementInfo[] = [];

      for (let i = 0; i < formattedExpenses.length; i += batchSize) {
        const batch = formattedExpenses.slice(i, i + batchSize);
        const batchExpenseSplitPromises = batch.map((expense) =>
          axios.get(
            `http://localhost:8000/users/${
              currentUser!.UserId
            }/expenseSplit?expenseIds=${expense.ExpenseId}`
          )
        );

        const batchExpenseSplitResponses = await Promise.all(
          batchExpenseSplitPromises
        );
        const batchExpenseSplitData = batchExpenseSplitResponses.map(
          (response) => response.data
        );
        console.log(batchExpenseSplitData)
        // Include ExpenseMakerUserId in each expenseSplit object
        const expenseSplitWithMakerId = batchExpenseSplitData.map(
          (expenseSplit, index) =>
            expenseSplit.map((split: any) => ({
              ...split,
              ExpenseMakerUserId: batch[index].ExpenseMakerUserId,
            }))
        );

        expenseSplitData.push(...expenseSplitWithMakerId);

        // Extract and store settlement info
        batchExpenseSplitData.forEach((expenseSplit, index) => {
          const settlement = expenseSplit.find(
            (split: { SettlementStatus: null }) =>
              split.SettlementStatus !== null
          );
          if (settlement) {
            settlementInfoData.push({
              ExpenseId: batch[index].ExpenseId,
              ExpenseSplitId: settlement.ExpenseSplitId,
              SettlementStatus: settlement.SettlementStatus,
              SettlementAmount: settlement.SettlementAmount,
              SettlementDate: new Date(settlement.SettlementDate),
              ExpenseMakerUserId: batch[index].ExpenseMakerUserId,
            });
          }
        });
      }
      
      console.log(expenseSplitData);
      console.log(settlementInfoData);
      setExpenseSplit(expenseSplitData);
      setSettlementInfo(settlementInfoData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const sortExpenses = (expenses: Expense[]) => {
    switch (sortBy) {
      case "Group":
        return expenses.sort((a, b) => a.GroupName.localeCompare(b.GroupName));
      case "Amount: Ascending":
        return expenses.sort((a, b) => a.Amount - b.Amount);
      case "Amount: Descending":
        return expenses.sort((a, b) => b.Amount - a.Amount);
      case "Date":
      default:
        return expenses.sort(
          (a, b) => b.DatePaid.getTime() - a.DatePaid.getTime()
        );
    }
  };
  function handleAcceptSettlement(ExpenseId: string): void {
    throw new Error("Function not implemented.");
  }

  // console.log("My expenses:", expenses)
  // console.log("original", expenses.toLocaleString)

  return (
    <div className="container-fluid expense-container">
      <h2 className="text-white">Expenses</h2>
      <div className="d-flex flex-row mb-3">
        <div className="dropdown">
          <button
            type="button"
            className="btn btn-success dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Sort By: {sortBy}
          </button>
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => handleSortChange("Date")}
            >
              Date
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleSortChange("Group")}
            >
              Group
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleSortChange("Amount: Ascending")}
            >
              Amount: Ascending
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleSortChange("Amount: Descending")}
            >
              Amount: Descending
            </button>
          </div>
        </div>
      </div>
      <ul className="list-unstyled">
        {loading && <h3 style={{ color: "white" }}>Loading...</h3>}
        {!loading && expenses.length === 0 && fetchAttempted && (
          <h3 style={{ color: "white" }}>No expenses found</h3>
        )}
        {!loading &&
          expenses.length > 0 &&
          sortExpenses(expenses).map((expense, index) => (
            <li key={expense.ExpenseId} className="expense-item">
              <div className="expense-details">
                <p className="expense-description">
                  Description: {expense.Description}
                </p>
                <ul>
                  {/* Display Other Members who are not logged in */}
                  {generateUserListItems(
                    expense.OtherMemberUserIds,
                    expense.OtherMemberDisplayNames,
                    expense.OtherMemberEmails,
                    currentUser
                  )}

                  {/* Displays expense maker if they are not logged in */}
                  {generateUserListItems(
                    [expense.ExpenseMakerUserId],
                    [expense.ExpenseMakerDisplayName],
                    [expense.ExpenseMakerEmail],
                    currentUser
                  )}
                </ul>

                <p className="expense-amount">Amount: ${expense.Amount}</p>
                <p className="expense-group">Group: {expense.GroupName}</p>
                <p className="expense-date">
                  Date Made:{" "}
                  {new Date(expense.DatePaid).toLocaleDateString(undefined, {
                    timeZone: "UTC", // Adjust to your desired timezone
                  })}
                </p>
                {/* Display expense split information */}
                {expenseSplit[index].map((split, idx) => {
                  // Calculate the amount owed based on the percentage
                  const amountOwed =
                    (expense.Amount * Number(split.Percentage)) / 100;
                  return (
                    <div key={idx}>
                      <p className="expense-amount">
                        Percentage: {split.Percentage}%
                      </p>
                      <p className="expense-amount">
                        Amount owed: ${amountOwed.toFixed(2)}
                      </p>
                    </div>
                  );
                })}

                {/* Add accept and decline buttons for settlement */}
                {settlementInfo[index] &&
                  settlementInfo[index].ExpenseSplitId &&
                  settlementInfo[index].SettlementStatus === "Pending" &&
                  currentUser &&
                  currentUser.UserId == expense.ExpenseMakerUserId && (
                    <div>
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleAcceptSettlement(expense.ExpenseId)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleAcceptSettlement(expense.ExpenseId)
                        }
                      >
                        Decline
                      </button>
                    </div>
                  )}

                {/* Add button to settle expense */}
                {expenseSplit[index] &&
                  expenseSplit[index].some(
                    (split) =>
                      (expense.Amount * Number(split.Percentage)) / 100 > 0
                  ) &&
                  // Conditionally render the "Settle Expense" button
                  (!currentUser ||
                  currentUser.UserId !== expense.ExpenseMakerUserId ? (
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target={`#exampleModal-${expense.ExpenseId}`}
                      onClick={() => setSelectedExpense(expense)}
                    >
                      Settle Expense
                    </button>
                  ) : null)}
              </div>
            </li>
          ))}
      </ul>

      {expenses.map((expense) => (
        <div
          key={expense.ExpenseId}
          className="modal fade"
          id={`exampleModal-${expense.ExpenseId}`}
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Settle Expense
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Dropdown for selecting email */}
                <div className="mb-3">
                  <label htmlFor="inputEmail" className="form-label">
                    Email
                  </label>
                  <select
                    className="form-select"
                    id="inputEmail"
                    value={email}
                    onChange={(e) => {
                      const selectedEmail = e.target.value;
                      setEmail(selectedEmail);

                      // Set the selected user ID to the expense maker's ID
                      setSelectedUserId(expense.ExpenseMakerUserId);
                    }}
                  >
                    {/* Placeholder option */}
                    <option value="">Select an email</option>
                    {/* Add option for the expense maker's email */}
                    <option value={expense.ExpenseMakerEmail}>
                      {expense.ExpenseMakerEmail}
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="inputAmount" className="form-label">
                    Settlement Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="inputAmount"
                    value={settlementAmount}
                    onChange={(e) =>
                      setSettlementAmount(Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setSelectedExpense(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSettleExpense}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
