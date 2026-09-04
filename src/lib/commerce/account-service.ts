export type AccountView = "overview" | "orders" | "addresses" | "profile";

export type AccountOrderStatus = "In transit" | "Completed";

export type AccountCustomer = {
  firstName: string;
  fullName: string;
  email: string;
  phone: string;
};

export type AccountAddress = {
  fullName: string;
  line1: string;
  city: string;
  region: string;
  country: string;
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

export type AccountDashboardData = {
  customer: AccountCustomer;
  defaultAddress: AccountAddress;
  orders: AccountOrder[];
  totalSpent: string;
  promotionalImage: string;
};

export type AccountCredentials = {
  email: string;
  password: string;
};

export type AccountAuthResult = {
  ok: boolean;
  message?: string;
};

export interface CustomerAccountService {
  getDashboard(): AccountDashboardData;
  signIn(credentials: AccountCredentials): AccountAuthResult;
  createAccount(credentials: AccountCredentials): AccountAuthResult;
  requestPasswordReset(email: string): string;
}

const mockAddress: AccountAddress = {
  fullName: "Alex Johnson",
  line1: "12 King Street",
  city: "Manchester",
  region: "M2 4WU",
  country: "United Kingdom",
};

const mockDashboard: AccountDashboardData = {
  customer: {
    firstName: "Alex",
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+44 7700 900123",
  },
  defaultAddress: mockAddress,
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
  ],
  totalSpent: "£146.00",
  promotionalImage: "/images/campaign-athlete.jpg",
};

const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const mockAccountService: CustomerAccountService = {
  getDashboard: () => mockDashboard,
  signIn: ({ email, password }) => {
    if (!validEmail.test(email)) {
      return { ok: false, message: "Enter a valid email address." };
    }

    if (password.length < 6) {
      return { ok: false, message: "Your password must be at least 6 characters." };
    }

    return { ok: true };
  },
  createAccount: ({ email, password }) => {
    if (!validEmail.test(email)) {
      return { ok: false, message: "Enter a valid email address." };
    }

    if (password.length < 6) {
      return { ok: false, message: "Your password must be at least 6 characters." };
    }

    return { ok: true };
  },
  requestPasswordReset: (email) =>
    `Password reset for ${email} will connect once the commerce platform is selected.`,
};

export const accountService: CustomerAccountService = mockAccountService;

