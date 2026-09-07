export type AccountView = "overview" | "orders" | "addresses" | "profile";

export type AccountOrderStatus = "Processing" | "In transit" | "Completed" | "Delivered" | "Cancelled";

export type AccountCustomer = {
  firstName: string;
  fullName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type AccountAddress = {
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  type: "Delivery" | "Billing";
  isDefault?: boolean;
};

export type AccountOrderItem = {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: string;
  image: string;
  alt: string;
};

export type AccountOrder = {
  id: string;
  date: string;
  status: AccountOrderStatus;
  total: string;
  subtotal: string;
  shipping: string;
  items: AccountOrderItem[];
  shippingAddress: AccountAddress;
};

export type AccountEmailPreferences = {
  orderUpdates: boolean;
  newDrops: boolean;
  marketing: boolean;
};

export type AccountDashboardData = {
  customer: AccountCustomer;
  defaultAddress: AccountAddress;
  addresses: AccountAddress[];
  billingAddresses: AccountAddress[];
  orders: AccountOrder[];
  overviewOrders: AccountOrder[];
  totalSpent: string;
  customerSince: string;
  accountStatus: "Active" | "Inactive";
  defaultCurrency: string;
  language: string;
  emailPreferences: AccountEmailPreferences;
  passwordLastUpdated: string;
  promotionalImage: string;
};

export type AccountCredentials = {
  email: string;
  password: string;
};

export type AccountRegistration = AccountCredentials & {
  firstName: string;
  lastName: string;
  phone?: string;
};

export type AccountApprovalStatus = "approved" | "pending" | "rejected";

export type AccountApprovalRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: AccountApprovalStatus;
  submittedAt: string;
};

export type AccountAuthResult = {
  ok: boolean;
  approvalStatus?: AccountApprovalStatus;
  message?: string;
};

export type AccountAdminResult = {
  ok: boolean;
  message?: string;
  request?: AccountApprovalRequest;
};

export interface CustomerAccountService {
  getDashboard(): AccountDashboardData;
  signIn(credentials: AccountCredentials): AccountAuthResult;
  createAccount(credentials: AccountRegistration): AccountAuthResult;
  requestPasswordReset(email: string): string;
  getAccountRequests(): AccountApprovalRequest[];
  approveAccountRequest(id: string): AccountAdminResult;
  rejectAccountRequest(id: string): AccountAdminResult;
}

const mockAddress: AccountAddress = {
  label: "Home",
  fullName: "Alex Johnson",
  line1: "12 King Street",
  city: "Manchester",
  region: "M2 4WU",
  country: "United Kingdom",
  phone: "+44 7700 900123",
  type: "Delivery",
  isDefault: true,
};

const mockAddresses: AccountAddress[] = [
  mockAddress,
  {
    label: "Work",
    fullName: "Alex Johnson",
    line1: "Unit 7, Trafford Park",
    line2: "Trafford Park Road",
    city: "Manchester",
    region: "M17 1BD",
    country: "United Kingdom",
    phone: "+44 7700 900123",
    type: "Delivery",
  },
  {
    label: "Parents' House",
    fullName: "Alex Johnson",
    line1: "43 Oakfield Road",
    city: "Stockport",
    region: "SK2 6PL",
    country: "United Kingdom",
    phone: "+44 7700 900123",
    type: "Delivery",
  },
];

const mockBillingAddresses: AccountAddress[] = [
  {
    ...mockAddress,
    type: "Billing",
  },
];

const mockDashboardData: Omit<AccountDashboardData, "overviewOrders"> = {
  customer: {
    firstName: "Alex",
    fullName: "Alex Johnson",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    phone: "+44 7700 900123",
  },
  defaultAddress: mockAddress,
  addresses: mockAddresses,
  billingAddresses: mockBillingAddresses,
  orders: [
    {
      id: "#PH-1024",
      date: "28 Aug 2026",
      status: "In transit",
      total: "£81.00",
      subtotal: "£73.00",
      shipping: "£8.00",
      items: [
        {
          id: "type-1-hoodie",
          name: "Type 1 Hoodie",
          variant: "Black / Small",
          quantity: 1,
          unitPrice: "£73.00",
          image: "/images/type-1-hoodie.jpg",
          alt: "Black PHENO Type 1 hoodie",
        },
      ],
      shippingAddress: mockAddress,
    },
    {
      id: "#PH-0991",
      date: "12 Aug 2026",
      status: "Completed",
      total: "£65.00",
      subtotal: "£57.00",
      shipping: "£8.00",
      items: [
        {
          id: "type-1-tshirt",
          name: "Type 1 T-Shirt",
          variant: "White / Small",
          quantity: 1,
          unitPrice: "£57.00",
          image: "/images/type-1-tshirt-white.jpg",
          alt: "White PHENO Type 1 T-shirt",
        },
      ],
      shippingAddress: mockAddress,
    },
    {
      id: "#PH-0876",
      date: "01 Aug 2026",
      status: "Completed",
      total: "£142.00",
      subtotal: "£134.00",
      shipping: "£8.00",
      items: [
        {
          id: "type-1-joggers",
          name: "Type 1 Joggers",
          variant: "Black / Small",
          quantity: 1,
          unitPrice: "£134.00",
          image: "/images/type-1-joggers.jpg",
          alt: "Black PHENO Type 1 joggers",
        },
      ],
      shippingAddress: mockAddress,
    },
    {
      id: "#PH-0750",
      date: "18 Jul 2026",
      status: "Delivered",
      total: "£96.00",
      subtotal: "£88.00",
      shipping: "£8.00",
      items: [
        {
          id: "type-1-shorts",
          name: "Type 1 Shorts",
          variant: "Black / Small",
          quantity: 1,
          unitPrice: "£88.00",
          image: "/images/type-1-shorts.jpg",
          alt: "Black PHENO Type 1 shorts",
        },
      ],
      shippingAddress: mockAddress,
    },
    {
      id: "#PH-0615",
      date: "05 Jul 2026",
      status: "Completed",
      total: "£58.00",
      subtotal: "£50.00",
      shipping: "£8.00",
      items: [
        {
          id: "type-1-tank",
          name: "Type 1 Tank",
          variant: "White / Small",
          quantity: 1,
          unitPrice: "£50.00",
          image: "/images/type-1-tank-white.jpg",
          alt: "White PHENO Type 1 tank",
        },
      ],
      shippingAddress: mockAddress,
    },
    {
      id: "#PH-0488",
      date: "21 Jun 2026",
      status: "Completed",
      total: "£110.00",
      subtotal: "£102.00",
      shipping: "£8.00",
      items: [
        {
          id: "type-1-joggers-2",
          name: "Type 1 Joggers",
          variant: "Black / Medium",
          quantity: 1,
          unitPrice: "£102.00",
          image: "/images/type-1-joggers.jpg",
          alt: "Black PHENO Type 1 joggers",
        },
      ],
      shippingAddress: mockAddress,
    },
    {
      id: "#PH-0312",
      date: "07 Jun 2026",
      status: "Completed",
      total: "£72.00",
      subtotal: "£64.00",
      shipping: "£8.00",
      items: [
        {
          id: "type-1-tshirt-2",
          name: "Type 1 T-Shirt",
          variant: "Black / Small",
          quantity: 1,
          unitPrice: "£64.00",
          image: "/images/type-1-tshirt.jpg",
          alt: "Black PHENO Type 1 T-shirt",
        },
      ],
      shippingAddress: mockAddress,
    },
  ],
  totalSpent: "£146.00",
  customerSince: "21 Jun 2026",
  accountStatus: "Active",
  defaultCurrency: "GBP (£)",
  language: "English",
  emailPreferences: { orderUpdates: true, newDrops: true, marketing: false },
  passwordLastUpdated: "12 Aug 2026",
  promotionalImage: "/images/campaign-athlete.jpg",
};

const mockDashboard: AccountDashboardData = {
  ...mockDashboardData,
  overviewOrders: mockDashboardData.orders.slice(0, 2),
};

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const accountRequestsStorageKey = "pheno-account-approval-requests";

function getStoredAccountRequests(): AccountApprovalRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedRequests = window.localStorage.getItem(accountRequestsStorageKey);
    const parsedRequests: unknown = storedRequests ? JSON.parse(storedRequests) : [];

    return Array.isArray(parsedRequests) ? parsedRequests as AccountApprovalRequest[] : [];
  } catch {
    return [];
  }
}

function saveStoredAccountRequests(requests: AccountApprovalRequest[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(accountRequestsStorageKey, JSON.stringify(requests));
  } catch {
    // The preview remains usable if local storage is unavailable.
  }
}

function findAccountRequestByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return getStoredAccountRequests().find((request) => request.email.toLowerCase() === normalizedEmail);
}

function createAccountRequestId() {
  return `account-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const mockAccountService: CustomerAccountService = {
  getDashboard: () => mockDashboard,
  signIn: ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!validEmail.test(normalizedEmail)) {
      return { ok: false, message: "Enter a valid email address." };
    }

    if (password.length < 6) {
      return { ok: false, message: "Your password must be at least 6 characters." };
    }

    const request = findAccountRequestByEmail(normalizedEmail);

    if (request?.status === "pending") {
      return {
        ok: false,
        approvalStatus: "pending",
        message: "Your account is awaiting admin approval before you can sign in.",
      };
    }

    if (request?.status === "rejected") {
      return {
        ok: false,
        approvalStatus: "rejected",
        message: "This account request was not approved. Please contact support.",
      };
    }

    return { ok: true, approvalStatus: "approved" };
  },
  createAccount: ({ firstName, lastName, email, phone, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!firstName.trim() || !lastName.trim()) {
      return { ok: false, message: "Enter your first and last name." };
    }

    if (!validEmail.test(normalizedEmail)) {
      return { ok: false, message: "Enter a valid email address." };
    }

    if (password.length < 6) {
      return { ok: false, message: "Your password must be at least 6 characters." };
    }

    const existingRequest = findAccountRequestByEmail(normalizedEmail);

    if (existingRequest?.status === "pending") {
      return {
        ok: false,
        approvalStatus: "pending",
        message: "This account is already awaiting admin approval.",
      };
    }

    if (existingRequest?.status === "approved") {
      return {
        ok: false,
        approvalStatus: "approved",
        message: "An account with this email already exists. Please sign in.",
      };
    }

    const nextRequest: AccountApprovalRequest = {
      id: createAccountRequestId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || undefined,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const requests = getStoredAccountRequests().filter((request) => request.email !== normalizedEmail);
    saveStoredAccountRequests([...requests, nextRequest]);

    return {
      ok: true,
      approvalStatus: "pending",
      message: "Your account request has been submitted. An admin must approve it before dashboard access is enabled.",
    };
  },
  requestPasswordReset: (email) =>
    `Password reset for ${email} will connect once the commerce platform is selected.`,
  getAccountRequests: () => getStoredAccountRequests(),
  approveAccountRequest: (id) => {
    const requests = getStoredAccountRequests();
    const requestIndex = requests.findIndex((request) => request.id === id);

    if (requestIndex < 0) {
      return { ok: false, message: "That account request could not be found." };
    }

    const request = { ...requests[requestIndex], status: "approved" as const };
    requests[requestIndex] = request;
    saveStoredAccountRequests(requests);

    return {
      ok: true,
      request,
      message: `${request.firstName} ${request.lastName} has been approved.`,
    };
  },
  rejectAccountRequest: (id) => {
    const requests = getStoredAccountRequests();
    const requestIndex = requests.findIndex((request) => request.id === id);

    if (requestIndex < 0) {
      return { ok: false, message: "That account request could not be found." };
    }

    const request = { ...requests[requestIndex], status: "rejected" as const };
    requests[requestIndex] = request;
    saveStoredAccountRequests(requests);

    return {
      ok: true,
      request,
      message: `${request.firstName} ${request.lastName} has been rejected.`,
    };
  },
};

export const accountService: CustomerAccountService = mockAccountService;
