// src/types/firestore.ts
import { Timestamp } from 'firebase/firestore'

// ============================================
// BASE TYPES
// ============================================

export type OrganizationType = 'company' | 'cv' | 'individual' | 'nonprofit'
export type UserRole = 'owner' | 'admin' | 'member'
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
export type NormalBalance = 'debit' | 'credit'
export type JournalType = 'general' | 'sales' | 'purchase' | 'cash_receipt' | 'cash_payment' | 'adjustment'
export type DocumentStatus = 'draft' | 'sent' | 'confirmed' | 'posted' | 'paid' | 'cancelled' | 'void'
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue'
export type PaymentMethod = 'cash' | 'bank_transfer' | 'credit_card' | 'check' | 'other'
export type StockMovementType = 'in' | 'out' | 'transfer' | 'adjustment'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern'
export type EmployeeStatus = 'active' | 'inactive' | 'terminated'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'leave'
export type LeaveType = 'sick' | 'annual' | 'unpaid' | 'other'
export type Gender = 'male' | 'female' | 'other'
export type SalaryType = 'monthly' | 'hourly' | 'daily'
export type AuditAction = 'create' | 'update' | 'delete' | 'void' | 'approve' | 'reject'

// ============================================
// MAIN COLLECTIONS
// ============================================

export interface Account {
    id: string
    code: string
    name: string
    type: AccountType
    category: string
    parentId?: string
    level: number
    isActive: boolean
    isSystemAccount: boolean
    normalBalance: NormalBalance
    balance: number
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface JournalLine {
    accountId: string
    accountCode: string
    accountName: string
    description?: string
    debit: number
    credit: number
}

export interface Journal {
    id: string
    journalNumber: string
    date: Timestamp
    referenceNumber?: string
    description: string
    type: JournalType
    lines: JournalLine[]
    totalDebit: number
    totalCredit: number
    status: 'draft' | 'posted' | 'void'
    postedAt?: Timestamp
    voidedAt?: Timestamp
    voidReason?: string
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
    updatedBy: string
}

export interface ProductVariant {
    id: string
    name: string
    sku: string
    price: number
    cost: number
}

export interface Product {
    id: string
    sku: string
    name: string
    description?: string
    category: string
    hasVariants: boolean
    variants?: ProductVariant[]
    cost: number
    price: number
    trackInventory: boolean
    unit: string
    minStock?: number
    maxStock?: number
    images: string[]
    isActive: boolean
    isSellable: boolean
    isPurchasable: boolean
    salesAccountId?: string
    purchaseAccountId?: string
    inventoryAccountId?: string
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface Warehouse {
    id: string
    code: string
    name: string
    address: string
    phone?: string
    isActive: boolean
    isDefault: boolean
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface Stock {
    id: string
    productId: string
    productSku: string
    productName: string
    warehouseId: string
    warehouseName: string
    quantity: number
    reservedQuantity: number
    availableQuantity: number
    averageCost: number
    totalValue: number
    lastMovementAt: Timestamp
    updatedAt: Timestamp
}

export interface StockMovement {
    id: string
    movementNumber: string
    date: Timestamp
    type: StockMovementType
    productId: string
    productSku: string
    productName: string
    fromWarehouseId?: string
    toWarehouseId?: string
    quantity: number
    unit: string
    unitCost: number
    totalCost: number
    referenceType?: 'purchase' | 'sale' | 'production' | 'adjustment'
    referenceId?: string
    referenceNumber?: string
    notes?: string
    createdAt: Timestamp
    createdBy: string
}

export interface Address {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
}

export interface Customer {
    id: string
    code: string
    name: string
    email?: string
    phone?: string
    billingAddress?: Address
    shippingAddress?: Address
    taxId?: string
    creditLimit?: number
    paymentTerms: number
    receivableAccountId?: string
    totalOrders: number
    totalRevenue: number
    outstandingBalance: number
    isActive: boolean
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface Supplier {
    id: string
    code: string
    name: string
    email?: string
    phone?: string
    address?: Address
    taxId?: string
    paymentTerms: number
    payableAccountId?: string
    totalOrders: number
    totalPurchases: number
    outstandingBalance: number
    isActive: boolean
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface OrderItem {
    productId: string
    productSku: string
    productName: string
    quantity: number
    unit: string
    unitPrice: number
    discount: number
    tax: number
    subtotal: number
    total: number
}

export interface SalesOrder {
    id: string
    orderNumber: string
    date: Timestamp
    customerId: string
    customerName: string
    customerEmail?: string
    shippingAddress: Address
    items: OrderItem[]
    subtotal: number
    discountTotal: number
    taxTotal: number
    shippingCost: number
    grandTotal: number
    status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    paymentStatus: PaymentStatus
    fulfillmentStatus: 'unfulfilled' | 'partial' | 'fulfilled'
    expectedDeliveryDate?: Timestamp
    deliveredAt?: Timestamp
    cancelledAt?: Timestamp
    notes?: string
    internalNotes?: string
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface Invoice {
    id: string
    invoiceNumber: string
    date: Timestamp
    dueDate: Timestamp
    customerId: string
    customerName: string
    customerEmail?: string
    salesOrderId?: string
    salesOrderNumber?: string
    items: OrderItem[]
    subtotal: number
    discountTotal: number
    taxTotal: number
    grandTotal: number
    paidAmount: number
    outstandingAmount: number
    paymentStatus: PaymentStatus
    status: 'draft' | 'sent' | 'viewed' | 'paid' | 'cancelled' | 'void'
    sentAt?: Timestamp
    paidAt?: Timestamp
    voidedAt?: Timestamp
    notes?: string
    termsAndConditions?: string
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface BankDetails {
    bankName: string
    accountNumber: string
    transactionId?: string
}

export interface Payment {
    id: string
    paymentNumber: string
    date: Timestamp
    type: 'receive' | 'pay'
    partyType: 'customer' | 'supplier'
    partyId: string
    partyName: string
    amount: number
    paymentMethod: PaymentMethod
    paymentAccountId: string
    referenceType?: 'invoice' | 'purchase_order' | 'bill'
    referenceId?: string
    referenceNumber?: string
    bankDetails?: BankDetails
    notes?: string
    status: 'pending' | 'completed' | 'cancelled'
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface PurchaseOrderItem extends OrderItem {
    receivedQuantity: number
}

export interface PurchaseOrder {
    id: string
    poNumber: string
    date: Timestamp
    supplierId: string
    supplierName: string
    supplierEmail?: string
    items: PurchaseOrderItem[]
    subtotal: number
    discountTotal: number
    taxTotal: number
    shippingCost: number
    grandTotal: number
    status: 'draft' | 'sent' | 'confirmed' | 'partial_received' | 'received' | 'cancelled'
    paymentStatus: PaymentStatus
    expectedDeliveryDate?: Timestamp
    receivedAt?: Timestamp
    cancelledAt?: Timestamp
    deliveryAddress?: string
    warehouseId?: string
    notes?: string
    internalNotes?: string
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface BankAccount {
    bankName: string
    accountNumber: string
    accountHolder: string
}

export interface EmployeeDocument {
    type: string
    name: string
    url: string
    uploadedAt: Timestamp
}

export interface Employee {
    id: string
    employeeNumber: string
    firstName: string
    lastName: string
    fullName: string
    email?: string
    phone?: string
    dateOfBirth?: Timestamp
    gender?: Gender
    address?: Address
    department?: string
    position: string
    employmentType: EmploymentType
    hireDate: Timestamp
    terminationDate?: Timestamp
    salary: number
    salaryType: SalaryType
    bankAccount?: BankAccount
    taxId?: string
    userId?: string
    status: EmployeeStatus
    documents?: EmployeeDocument[]
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface LocationData {
    latitude: number
    longitude: number
    address?: string
}

export interface Attendance {
    id: string
    employeeId: string
    employeeName: string
    date: Timestamp
    clockIn?: Timestamp
    clockOut?: Timestamp
    clockInLocation?: LocationData
    clockOutLocation?: LocationData
    workingHours?: number
    overtimeHours?: number
    status: AttendanceStatus
    leaveType?: LeaveType
    notes?: string
    isApproved: boolean
    approvedBy?: string
    approvedAt?: Timestamp
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface PayrollItem {
    name: string
    amount: number
}

export interface Payroll {
    id: string
    payrollNumber: string
    periodStart: Timestamp
    periodEnd: Timestamp
    paymentDate: Timestamp
    employeeId: string
    employeeNumber: string
    employeeName: string
    basicSalary: number
    allowances: PayrollItem[]
    overtime: number
    bonus: number
    totalEarnings: number
    deductions: PayrollItem[]
    tax: number
    totalDeductions: number
    netPay: number
    workingDays: number
    presentDays: number
    absentDays: number
    leaveDays: number
    status: 'draft' | 'approved' | 'paid'
    paymentMethod?: PaymentMethod
    paidAt?: Timestamp
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}

export interface NumberFormats {
    salesOrder: string
    invoice: string
    purchaseOrder: string
    journal: string
    payment: string
    product: string
    customer: string
    supplier: string
    employee: string
}

export interface NextNumbers {
    salesOrder: number
    invoice: number
    purchaseOrder: number
    journal: number
    payment: number
    product: number
    customer: number
    supplier: number
    employee: number
}

export interface SMTPSettings {
    host: string
    port: number
    username: string
    password: string
}

export interface EmailSettings {
    fromName: string
    fromEmail: string
    replyTo: string
    smtp?: SMTPSettings
}

export interface Templates {
    invoiceTemplate: string
    quotationTemplate: string
}

export interface Settings {
    numberFormats: NumberFormats
    nextNumbers: NextNumbers
    emailSettings?: EmailSettings
    templates?: Templates
    updatedAt: Timestamp
    updatedBy: string
}

export interface AuditLogChange {
    field: string
    oldValue: any
    newValue: any
}

export interface AuditLog {
    id: string
    timestamp: Timestamp
    userId: string
    userName: string
    userEmail: string
    action: AuditAction
    collection: string
    documentId: string
    documentType: string
    changes?: AuditLogChange[]
    ipAddress?: string
    userAgent?: string
    notes?: string
}

// ============================================
// HELPER TYPES
// ============================================

export interface FirestoreTimestamps {
    createdAt: Timestamp
    updatedAt: Timestamp
}

export interface WithCreator {
    createdBy: string
    createdAt: Timestamp
}

export interface WithUpdater {
    updatedBy: string
    updatedAt: Timestamp
}

// For creating new documents (without ID and timestamps)
export type CreateData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

// For updating documents (partial with updatedAt)
export type UpdateData<T> = Partial<Omit<T, 'id' | 'createdAt'>> & { updatedAt: Timestamp }

// ============================================
// QUERY FILTERS
// ============================================

export interface DateRangeFilter {
    startDate: Date
    endDate: Date
}

export interface PaginationOptions {
    limit: number
    offset?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
}

export interface SearchOptions extends PaginationOptions {
    searchTerm?: string
    filters?: Record<string, any>
}