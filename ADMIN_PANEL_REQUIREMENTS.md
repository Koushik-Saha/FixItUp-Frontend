# Admin Panel Requirements

Since you have a separate admin panel project, here's what you need to implement to manage your Max Phone Repair e-commerce platform.

## 🔗 API Endpoints (Already Available in Frontend)

Your admin panel can use these existing API endpoints:

### Dashboard & Analytics
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data

### Inventory Management
- `GET /api/admin/inventory` - Get inventory across all stores
- `POST /api/admin/inventory` - Update inventory
- `GET /api/admin/inventory/users` - User inventory management

### Products (Need to Create These APIs)
Currently missing - you'll need to add:
- `GET /api/admin/products` - List all products with filters
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `POST /api/admin/products/bulk-import` - Bulk import products

### Orders
- `GET /api/orders` - List all orders (admin sees all)
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status (admin only)

### Wholesale Applications
- `GET /api/wholesale/applications` - List all applications
- `POST /api/wholesale/approve/[id]` - Approve/reject application

### Repair Tickets
- `GET /api/repairs` - List all repair tickets (admin sees all)
- `GET /api/repairs/[id]` - Get ticket details
- `PATCH /api/repairs/[id]` - Update ticket status

---

## 🎨 Admin Panel Features to Build

### 1. Product Management (CRITICAL)

**List Products Page**
```
URL: /admin/products
Features:
- Table with: Image, SKU, Name, Brand, Model, Category, Stock, Price, Status
- Filters: Category, Brand, Status (active/inactive), Stock level
- Search: By name, SKU, brand, model
- Bulk actions: Activate/Deactivate, Delete, Export
- Pagination
```

**Create/Edit Product Page**
```
URL: /admin/products/new or /admin/products/[id]/edit
Fields:
- Basic Info: Name, SKU, Slug, Category
- Device: Brand, Model, Product Type
- Pricing: Base Price, Cost Price, Wholesale Discounts (Tier 1/2/3)
- Inventory: Total Stock, Low Stock Threshold
- Media: Images upload, Thumbnail
- Details: Description, Specifications (JSON)
- SEO: Meta Title, Meta Description
- Flags: Active, Featured, New, Bestseller
```

**Bulk Import**
```
Feature: Upload CSV with product data
Columns: SKU, Name, Brand, Model, Category, Price, Stock, etc.
Validation: Check required fields, duplicate SKUs
Preview: Show what will be imported
Execute: Import with progress bar
```

---

### 2. Order Management (CRITICAL)

**Orders List**
```
URL: /admin/orders
Features:
- Table: Order#, Date, Customer, Status, Payment, Total, Actions
- Filters: Status, Payment Status, Date Range, Customer Type (retail/wholesale)
- Search: By order number, customer name, email
- Export: CSV/Excel export
- Quick actions: View, Update Status, Refund
```

**Order Details Page**
```
URL: /admin/orders/[id]
Sections:
1. Order Info: Order#, Date, Status, Payment Status
2. Customer: Name, Email, Phone, Customer Type
3. Items: Product, Quantity, Price, Discount, Subtotal
4. Shipping: Address, Method, Tracking#, Carrier
5. Payment: Method, Intent ID, Amount
6. Timeline: Order events (placed, processing, shipped, delivered)
7. Actions:
   - Update Status (dropdown)
   - Add Tracking Number
   - Add Admin Notes
   - Process Refund
   - Print Invoice
   - Email Customer
```

**Status Update Form**
```
Fields:
- Status (dropdown): Processing, Shipped, Delivered, Cancelled
- Tracking Number (if shipped)
- Carrier (if shipped)
- Admin Notes
- Send Email Notification (checkbox - checked by default)
```

---

### 3. Customer Management

**Customers List**
```
URL: /admin/customers
Features:
- Table: Name, Email, Role, Orders Count, Total Spent, Wholesale Status
- Filters: Role (customer/wholesale/admin), Wholesale Status
- Search: By name, email, phone
- Actions: View Profile, Edit, Block/Unblock
```

**Customer Profile**
```
URL: /admin/customers/[id]
Sections:
- Profile: Name, Email, Phone, Role, Wholesale Info
- Orders: List of customer's orders
- Repairs: List of customer's repair tickets
- Addresses: Saved addresses
- Notes: Admin notes about customer
- Actions:
  - Edit Profile
  - Change Wholesale Tier
  - Reset Password
  - Send Email
```

---

### 4. Wholesale Management

**Applications List**
```
URL: /admin/wholesale/applications
Features:
- Tabs: Pending, Approved, Rejected
- Table: Business Name, Email, Type, Requested Tier, Date, Actions
- Search: By business name, email
- Quick approve/reject
```

**Application Review**
```
URL: /admin/wholesale/applications/[id]
Sections:
- Business Info: Name, Type, Tax ID, Website, Phone
- Contact: Email, Phone
- Address
- Documents (if uploaded)
- Status History
- Admin Notes
Actions:
- Approve (select tier: Tier1/2/3, add notes)
- Reject (add reason, notes)
```

---

### 5. Repair Ticket Management

**Tickets List**
```
URL: /admin/repairs
Features:
- Table: Ticket#, Customer, Device, Issue, Status, Priority, Date
- Filters: Status, Priority, Store, Technician
- Search: By ticket#, customer, device
- Sorting: By date, priority
```

**Ticket Details**
```
URL: /admin/repairs/[id]
Sections:
- Ticket Info: Ticket#, Status, Priority
- Customer: Name, Email, Phone
- Device: Brand, Model, IMEI/Serial, Images
- Issue: Description, Category
- Assignment: Store, Technician, Appointment
- Costs: Estimated, Actual, Parts, Labor
- Notes: Customer Notes, Technician Notes, Internal Notes
- Timeline: Status changes
Actions:
- Update Status
- Assign Technician/Store
- Update Costs
- Add Notes
- Mark Complete
- Email Customer
```

---

### 6. Inventory Management

**Inventory Dashboard**
```
URL: /admin/inventory
Features:
- Overview: Total Products, Low Stock Items, Out of Stock
- Multi-store view
- Filter by: Store, Category, Stock Level
- Bulk stock adjustment
```

**Stock Adjustment**
```
Features:
- Select Product
- Current Stock (per store)
- Adjustment: Add/Remove/Set
- Reason: Restock, Damage, Correction, Transfer
- Notes
- Transfer between stores
```

**Low Stock Alerts**
```
Features:
- Products below threshold
- Alert configuration
- Email notifications
- Reorder suggestions
```

---

### 7. Coupons Management

**Coupons List**
```
URL: /admin/coupons
Features:
- Table: Code, Type, Value, Usage, Status, Expiry
- Filters: Status (active/expired), Type
- Create New Coupon
```

**Create/Edit Coupon**
```
Fields:
- Code: Unique code (auto-generate option)
- Description
- Type: Percentage or Fixed Amount
- Value
- Restrictions:
  - Minimum Purchase
  - Maximum Discount (for percentage)
  - Max Uses Total
  - Max Uses Per User
  - Applies To: All/Specific Products/Categories
  - User Restrictions: All/New Customers/Wholesale/Retail
- Dates: Start Date, End Date
- Status: Active/Inactive
```

---

### 8. Analytics Dashboard

**Main Dashboard**
```
URL: /admin/dashboard (or /admin)
Widgets:
1. Today's Stats: Sales, Orders, Customers
2. Revenue Chart: Last 30 days
3. Order Status: Pending, Processing, Shipped
4. Top Products: Best sellers
5. Low Stock Alert: Products below threshold
6. Recent Orders: Last 10 orders
7. Wholesale Applications: Pending count
8. Repair Tickets: By status
```

**Detailed Analytics**
```
URL: /admin/analytics
Tabs:
- Sales: Revenue trends, comparisons
- Products: Top sellers, categories
- Customers: New vs returning, lifetime value
- Geography: Sales by state/city
- Performance: Average order value, conversion rate
```

---

### 9. Homepage Management

**Banners**
```
URL: /admin/homepage/banners
Features:
- List banners with preview
- Create/Edit banner:
  - Title, Subtitle
  - Image upload (desktop + mobile)
  - Link URL, Link Text
  - Colors (background, text)
  - Display Order
  - Active/Inactive
  - Schedule (start/end dates)
```

**Categories Display**
```
- Reorder categories
- Set category icons
- Hide/show categories
```

---

### 10. Settings

**General Settings**
```
- Company Info: Name, Logo, Contact
- Tax Settings: Default tax rate per state
- Shipping Settings: Methods, rates, zones
- Email Settings: From email, support email
- Payment Settings: Stripe keys
```

**User Management**
```
- Admin Users: Add/remove admin accounts
- Permissions: Role-based access control
```

---

## 🛠️ Technical Implementation

### Authentication
Use the same Supabase instance and check for `role = 'admin'` in profiles table:

```typescript
// In your admin panel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Check if user is admin
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin') {
  // Redirect or show error
}
```

### API Calls
Point to your main frontend API:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://yourdomain.com/api'

async function getOrders() {
  const response = await fetch(`${API_BASE}/orders`)
  return response.json()
}
```

### Missing API Endpoints You Need to Create

Create these in your main frontend project (`/src/app/api/admin/`):

**Products API**
```typescript
// /src/app/api/admin/products/route.ts
export async function GET(request) {
  // List products with filters
}

export async function POST(request) {
  // Create product
}

// /src/app/api/admin/products/[id]/route.ts
export async function PUT(request, { params }) {
  // Update product
}

export async function DELETE(request, { params }) {
  // Delete product
}
```

**Categories API**
```typescript
// /src/app/api/admin/categories/route.ts
export async function GET() {
  // List categories
}

export async function POST(request) {
  // Create category
}
```

**Customers API**
```typescript
// /src/app/api/admin/customers/route.ts
export async function GET(request) {
  // List customers with filters
}

// /src/app/api/admin/customers/[id]/route.ts
export async function GET(request, { params }) {
  // Get customer details
}

export async function PATCH(request, { params }) {
  // Update customer (change tier, role, etc.)
}
```

**Coupons API**
```typescript
// /src/app/api/admin/coupons/route.ts
export async function GET() {
  // List coupons
}

export async function POST(request) {
  // Create coupon
}

// /src/app/api/admin/coupons/[id]/route.ts
export async function PUT(request, { params }) {
  // Update coupon
}

export async function DELETE(request, { params }) {
  // Delete coupon
}
```

---

## 📦 Recommended Tech Stack for Admin Panel

### Option 1: Next.js Admin (Recommended)
```
Framework: Next.js 15 (same as main project)
UI: shadcn/ui + Tailwind CSS
Tables: @tanstack/react-table
Charts: recharts
Forms: react-hook-form + zod
State: Zustand or React Query
Auth: Supabase Auth (same instance)
```

**Pros:** Code sharing, same tech stack, easy deployment

### Option 2: React Admin Framework
```
Framework: React Admin or Refine
Backend: Your existing Next.js APIs
Auth: Supabase
```

**Pros:** Pre-built components, faster development

### Option 3: Custom Dashboard
```
Framework: Vite + React
UI: Your choice (Material UI, Ant Design, etc.)
API: Fetch from your Next.js backend
```

**Pros:** Complete control, lighter weight

---

## 🚀 Quick Start for Admin Panel

### Step 1: Create Admin Project
```bash
npx create-next-app@latest admin-panel
cd admin-panel
npm install @supabase/supabase-js @tanstack/react-table recharts
```

### Step 2: Set Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Create Protected Layout
```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/unauthorized')
      return
    }

    setIsAdmin(true)
  }

  if (!isAdmin) return <LoadingSpinner />

  return <>{children}</>
}
```

### Step 4: Build Priority Pages
1. Dashboard (use existing `/api/admin/dashboard`)
2. Orders list and details
3. Products list and create/edit
4. Wholesale applications review

---

## 📊 Data Tables Example

Use @tanstack/react-table for all admin tables:

```typescript
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

const columns = [
  { accessorKey: 'order_number', header: 'Order #' },
  { accessorKey: 'customer_name', header: 'Customer' },
  { accessorKey: 'total_amount', header: 'Total' },
  { accessorKey: 'status', header: 'Status' },
]

function OrdersTable() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setData(data.data))
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return <div>{/* Render table */}</div>
}
```

---

## ✅ Development Priority

**Week 1:**
- [ ] Set up admin project
- [ ] Create admin authentication
- [ ] Build dashboard page
- [ ] Build orders list page
- [ ] Build order details page with status update

**Week 2:**
- [ ] Create product management APIs in main project
- [ ] Build products list page
- [ ] Build product create/edit page
- [ ] Build bulk import feature

**Week 3:**
- [ ] Build wholesale applications review page
- [ ] Build repair tickets management
- [ ] Build inventory management
- [ ] Build customer management

**Week 4:**
- [ ] Build coupons management
- [ ] Build analytics dashboard
- [ ] Build settings page
- [ ] Testing and bug fixes

---

## 🔒 Security Checklist

- [ ] All admin routes check for `role = 'admin'`
- [ ] RLS policies prevent non-admins from seeing sensitive data
- [ ] API endpoints validate admin role server-side
- [ ] Sensitive actions require confirmation
- [ ] Audit log for admin actions
- [ ] Session timeout for security
- [ ] HTTPS only in production

---

## 📚 Resources

- [React Admin](https://marmelab.com/react-admin/)
- [Refine](https://refine.dev/)
- [TanStack Table](https://tanstack.com/table/latest)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)

---

**Your admin panel is the control center for your business. Take time to build it well!** 🎯
