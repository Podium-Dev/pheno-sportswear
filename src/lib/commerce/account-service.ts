export type AccountView = "overview" | "orders" | "addresses" | "profile";

export type AccountOrderStatus = "Processing" | "In transit" | "Completed" | "Delivered" | "Cancelled";

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
  overviewOrders: AccountOrder[];
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

const mockDashboardData: Omit<AccountDashboardData, "overviewOrders"> = {
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
  promotionalImage: "/images/campaign-athlete.jpg",
};

const mockDashboard: AccountDashboardData = {
  ...mockDashboardData,
  overviewOrders: mockDashboardData.orders.slice(0, 2),
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
