// MVP: Test accounts for development and testing
export const TEST_ACCOUNTS = {
  admin: {
    email: "admin@test.com",
    password: "Admin123!",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
  employee: {
    email: "employee@test.com",
    password: "Employee123!",
    firstName: "Test",
    lastName: "Employee",
    role: "employee",
  },
};

// MVP: Only use in development mode
export const isTestAccount = (email: string) => {
  return Object.values(TEST_ACCOUNTS).some(
    (account) => account.email === email
  );
};
