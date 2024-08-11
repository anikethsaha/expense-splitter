import {
  FrontendSplit,
  SplitType,
  CustomSplitType,
  FrontendSplitType,
} from "./models/Split";
import { FrontendExpense, Status } from "./models/Expense";
import { User, userDbInstance } from "./models/user";
import { v4 as uuidv4 } from "uuid";
import { Friend } from "./models/Friend";

// Dummy Users
export const user1: User = {
  id: "user-1",
  name: "John Doe",
  phone_number: "1234567890",
  created_at: new Date().toISOString(),
};

export const user2: User = {
  id: "user-2",
  name: "Jane Smith",
  phone_number: "0987654321",
  created_at: new Date().toISOString(),
};

export const user3: User = {
  id: "user-3",
  name: "Alice Johnson",
  phone_number: "1112223333",
  created_at: new Date().toISOString(),
};

// Dummy Expenses
export const expense1: FrontendExpense = {
  id: "expense-1",
  borrower_id: user1.id,
  lender_id: user2.id,
  amount: 100,
  status: Status.OPEN,
  created_at: new Date(),
  updated_at: new Date(),
  borrower_user: user1,
  lender_user: user2,
};

export const expense2: FrontendExpense = {
  id: "expense-2",
  borrower_id: user2.id,
  lender_id: user1.id,
  amount: 200,
  status: Status.PAID,
  created_at: new Date(),
  updated_at: new Date(),
  borrower_user: user2,
  lender_user: user1,
};

export const expense3: FrontendExpense = {
  id: "expense-3",
  borrower_id: user3.id,
  lender_id: user1.id,
  amount: 150,
  status: Status.OPEN,
  created_at: new Date(),
  updated_at: new Date(),
  borrower_user: user3,
  lender_user: user1,
};

export const DUMMY_FRIEND: Friend[] = [
  {
    id: uuidv4(),
    user_1: "user1",
    user_2: "user2",
    created_at: new Date(),
    user_1_name: "John",
    user_2_name: "Jane",
  },
  {
    id: uuidv4(),
    user_1: "user3",
    user_2: "user4",
    created_at: new Date(),
    user_1_name: "Mike",
    user_2_name: "Emily",
  },
  {
    id: uuidv4(),
    user_1: "user5",
    user_2: "user6",
    created_at: new Date(),
    user_1_name: "David",
    user_2_name: "Sarah",
  },
  {
    id: uuidv4(),
    user_1: "user7",
    user_2: "user8",
    created_at: new Date(),
    user_1_name: "Alex",
    user_2_name: "Olivia",
  },
  {
    id: uuidv4(),
    user_1: "user9",
    user_2: "user10",
    created_at: new Date(),
    user_1_name: "Daniel",
    user_2_name: "Sophia",
  },
];

// user seed

export const seedUsersIfNeeded = async () => {
  try {
    const result = await userDbInstance.allDocs();
    const totalUsers = result.total_rows;

    // seed if less than 10
    if (totalUsers < 10) {
      const users: User[] = [
        {
          id: uuidv4(),
          name: "Alice",
          phone_number: "1234567890",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Bob",
          phone_number: "0987654321",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Charlie",
          phone_number: "2345678901",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "David",
          phone_number: "3456789012",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Eve",
          phone_number: "4567890123",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Frank",
          phone_number: "5678901234",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Grace",
          phone_number: "6789012345",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Heidi",
          phone_number: "7890123456",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Ivan",
          phone_number: "8901234567",
          created_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          name: "Judy",
          phone_number: "9012345678",
          created_at: new Date().toISOString(),
        },
      ];

      const usersToInsert = users.slice(0, 10 - totalUsers);

      await userDbInstance.bulkDocs(usersToInsert);
      console.log(`${usersToInsert.length} users seeded successfully`);
    } else {
      console.log("No seeding needed, user count is sufficient");
    }
  } catch (error) {
    console.error("Error checking or seeding users:", error);
  }
};
