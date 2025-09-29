import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // In production, fetch from database
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email }
        // });

        // For demo purposes
        const demoUser = {
          id: "user_demo_123",
          email: credentials.email,
          name: "Demo User",
          role: "customer",
          image: null
        };

        // Demo password check (password: "password123")
        const demoPasswordHash = "$2a$10$K7L1OJ0TfgIqE3p9XqHqHOqHQLVU8.lAerzGqhGaGxe7u8P6Axqwm";
        const isValid = await bcrypt.compare(credentials.password, demoPasswordHash);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return demoUser;
      }
    }),
    // Uncomment when configured
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    // })
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "customer";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

// Role-based access control
export const ROLES = {
  // Customers
  CUSTOMER: 'customer',
  PREMIUM_CUSTOMER: 'premium_customer',

  // Agents & Partners
  DSA_AGENT: 'dsa_agent',
  COLLECTION_AGENT: 'collection_agent',
  FIELD_AGENT: 'field_agent',
  VERIFICATION_AGENT: 'verification_agent',

  // Staff
  LOAN_OFFICER: 'loan_officer',
  CREDIT_ANALYST: 'credit_analyst',
  OPERATIONS_STAFF: 'operations_staff',
  CUSTOMER_SUPPORT: 'customer_support',

  // Management
  BRANCH_MANAGER: 'branch_manager',
  REGIONAL_MANAGER: 'regional_manager',
  ZONAL_HEAD: 'zonal_head',

  // Specialized Roles
  RISK_OFFICER: 'risk_officer',
  COMPLIANCE_OFFICER: 'compliance_officer',
  AUDIT_OFFICER: 'audit_officer',
  IT_ADMIN: 'it_admin',

  // Top Level
  SUPER_ADMIN: 'super_admin',
  SYSTEM: 'system'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Permission definitions
export const PERMISSIONS = {
  // Loan Management
  LOAN_VIEW_OWN: 'loan:view:own',
  LOAN_VIEW_ALL: 'loan:view:all',
  LOAN_CREATE: 'loan:create',
  LOAN_APPROVE_SMALL: 'loan:approve:small',     // < 1L
  LOAN_APPROVE_MEDIUM: 'loan:approve:medium',   // 1L - 10L
  LOAN_APPROVE_LARGE: 'loan:approve:large',     // > 10L
  LOAN_MODIFY: 'loan:modify',
  LOAN_CANCEL: 'loan:cancel',

  // User Management
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_MODIFY: 'user:modify',
  USER_DELETE: 'user:delete',
  USER_VERIFY: 'user:verify',

  // Collection Management
  COLLECTION_VIEW: 'collection:view',
  COLLECTION_CREATE: 'collection:create',
  COLLECTION_ASSIGN: 'collection:assign',
  COLLECTION_UPDATE: 'collection:update',

  // Reports
  REPORT_VIEW_OWN: 'report:view:own',
  REPORT_VIEW_BRANCH: 'report:view:branch',
  REPORT_VIEW_REGION: 'report:view:region',
  REPORT_VIEW_ALL: 'report:view:all',
  REPORT_GENERATE: 'report:generate',
  REPORT_EXPORT: 'report:export',

  // System
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_AUDIT: 'system:audit',
  SYSTEM_BACKUP: 'system:backup',

  // Risk & Compliance
  RISK_ASSESSMENT: 'risk:assessment',
  RISK_OVERRIDE: 'risk:override',
  COMPLIANCE_REVIEW: 'compliance:review',
  COMPLIANCE_REPORT: 'compliance:report',
} as const;

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [ROLES.CUSTOMER]: [
    PERMISSIONS.LOAN_VIEW_OWN,
    PERMISSIONS.REPORT_VIEW_OWN,
  ],

  [ROLES.PREMIUM_CUSTOMER]: [
    PERMISSIONS.LOAN_VIEW_OWN,
    PERMISSIONS.REPORT_VIEW_OWN,
    PERMISSIONS.LOAN_CREATE,
  ],

  [ROLES.DSA_AGENT]: [
    PERMISSIONS.LOAN_CREATE,
    PERMISSIONS.LOAN_VIEW_OWN,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.REPORT_VIEW_OWN,
  ],

  [ROLES.LOAN_OFFICER]: [
    PERMISSIONS.LOAN_VIEW_ALL,
    PERMISSIONS.LOAN_CREATE,
    PERMISSIONS.LOAN_MODIFY,
    PERMISSIONS.LOAN_APPROVE_SMALL,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_VERIFY,
    PERMISSIONS.REPORT_VIEW_BRANCH,
  ],

  [ROLES.BRANCH_MANAGER]: [
    PERMISSIONS.LOAN_VIEW_ALL,
    PERMISSIONS.LOAN_CREATE,
    PERMISSIONS.LOAN_MODIFY,
    PERMISSIONS.LOAN_APPROVE_MEDIUM,
    PERMISSIONS.LOAN_CANCEL,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_MODIFY,
    PERMISSIONS.COLLECTION_VIEW,
    PERMISSIONS.COLLECTION_ASSIGN,
    PERMISSIONS.REPORT_VIEW_BRANCH,
    PERMISSIONS.REPORT_GENERATE,
    PERMISSIONS.REPORT_EXPORT,
  ],

  [ROLES.REGIONAL_MANAGER]: [
    ...ROLE_PERMISSIONS[ROLES.BRANCH_MANAGER],
    PERMISSIONS.LOAN_APPROVE_LARGE,
    PERMISSIONS.REPORT_VIEW_REGION,
    PERMISSIONS.RISK_ASSESSMENT,
  ],

  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.SYSTEM]: Object.values(PERMISSIONS),

  // Add other roles...
  [ROLES.COLLECTION_AGENT]: [
    PERMISSIONS.COLLECTION_VIEW,
    PERMISSIONS.COLLECTION_UPDATE,
    PERMISSIONS.REPORT_VIEW_OWN,
  ],

  [ROLES.FIELD_AGENT]: [
    PERMISSIONS.USER_VERIFY,
    PERMISSIONS.REPORT_VIEW_OWN,
  ],

  [ROLES.VERIFICATION_AGENT]: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_VERIFY,
    PERMISSIONS.REPORT_VIEW_OWN,
  ],

  [ROLES.CREDIT_ANALYST]: [
    PERMISSIONS.LOAN_VIEW_ALL,
    PERMISSIONS.RISK_ASSESSMENT,
    PERMISSIONS.REPORT_VIEW_ALL,
    PERMISSIONS.REPORT_GENERATE,
  ],

  [ROLES.OPERATIONS_STAFF]: [
    PERMISSIONS.LOAN_VIEW_ALL,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.REPORT_VIEW_BRANCH,
  ],

  [ROLES.CUSTOMER_SUPPORT]: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.LOAN_VIEW_ALL,
    PERMISSIONS.REPORT_VIEW_OWN,
  ],

  [ROLES.ZONAL_HEAD]: [
    ...ROLE_PERMISSIONS[ROLES.REGIONAL_MANAGER],
    PERMISSIONS.REPORT_VIEW_ALL,
    PERMISSIONS.RISK_OVERRIDE,
  ],

  [ROLES.RISK_OFFICER]: [
    PERMISSIONS.RISK_ASSESSMENT,
    PERMISSIONS.RISK_OVERRIDE,
    PERMISSIONS.REPORT_VIEW_ALL,
    PERMISSIONS.REPORT_GENERATE,
  ],

  [ROLES.COMPLIANCE_OFFICER]: [
    PERMISSIONS.COMPLIANCE_REVIEW,
    PERMISSIONS.COMPLIANCE_REPORT,
    PERMISSIONS.REPORT_VIEW_ALL,
    PERMISSIONS.SYSTEM_AUDIT,
  ],

  [ROLES.AUDIT_OFFICER]: [
    PERMISSIONS.SYSTEM_AUDIT,
    PERMISSIONS.REPORT_VIEW_ALL,
    PERMISSIONS.REPORT_GENERATE,
    PERMISSIONS.REPORT_EXPORT,
  ],

  [ROLES.IT_ADMIN]: [
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_AUDIT,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_MODIFY,
  ],
};

// Helper function to check permissions
export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

// Helper function to check multiple permissions (ANY)
export function hasAnyPermission(role: Role, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// Helper function to check multiple permissions (ALL)
export function hasAllPermissions(role: Role, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}