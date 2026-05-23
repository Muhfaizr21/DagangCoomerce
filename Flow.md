# StoreMaker - Complete System Workflow Documentation

**Tech Stack**: Golang (Backend) + React (Frontend) + PostgreSQL (Database)

---

## 📋 Table of Contents

1. [User Registration & Authentication](#1️⃣-alur-registrasi--login-user)
2. [Store Setup & Design](#2️⃣-alur-setup-store--design-customization)
3. [Product Management](#3️⃣-alur-manajemen-produk)
4. [Shopping Cart & Checkout](#4️⃣-alur-shopping-cart--checkout)
5. [Payment Processing](#5️⃣-alur-pembayaran-payment-flow)
6. [Order Management](#6️⃣-alur-manajemen-order-admin)
7. [Inventory Management](#7️⃣-alur-inventory--stock-management)
8. [Analytics & Reporting](#8️⃣-alur-analytics--reporting)
9. [Email Notifications](#9️⃣-alur-email--notification)
10. [Complete System Flow](#🔟-full-system-flow-diagram)

---

## 1️⃣ ALUR REGISTRASI & LOGIN USER

### A. User Registration (First Time)

```
┌─ START: User mengakses landing page
│
├─ Click "Sign Up" button
│
├─ Redirect ke RegisterPage (/auth/register)
│  └─ React component renders registration form
│     • Email input
│     • Password input (strength validator)
│     • Confirm password
│     • Store name input
│     • Terms & conditions checkbox
│
├─ User fills form & clicks "Create Account"
│
├─ React Frontend Validation (Client-side)
│  ├─ Validate email format (regex)
│  ├─ Check password min 8 characters
│  ├─ Check passwords match
│  ├─ Validate store name not empty
│  └─ If validation fails → Show error toast, STOP
│
├─ If valid → Show loading spinner
│
├─ POST /api/auth/register (FRONTEND SENDS)
│  └─ Axios sends JSON to Golang backend
│     {
│       "email": "merchant@example.com",
│       "password": "SecurePass123",
│       "storeName": "My Beautiful Store"
│     }
│
├─ GOLANG BACKEND RECEIVES
│  │
│  ├─ AuthHandler.Register() starts
│  │
│  ├─ Bind & validate JSON request
│  │  └─ If error → Return 400 Bad Request
│  │
│  ├─ Call authService.Register()
│  │  │
│  │  ├─ Validate email not already registered
│  │  │  └─ Query database: SELECT * FROM users WHERE email = ?
│  │  │     • If exists → Return error "Email already registered"
│  │  │
│  │  ├─ Validate password strength
│  │  │  • Min 8 chars, uppercase, lowercase, number
│  │  │  └─ If weak → Return error "Password too weak"
│  │  │
│  │  ├─ Hash password with bcrypt
│  │  │  └─ password_hash = bcrypt.GenerateFromPassword(password, cost=10)
│  │  │
│  │  ├─ Create user record in database
│  │  │  └─ INSERT INTO users (email, password_hash, created_at)
│  │  │
│  │  ├─ Create default store for user
│  │  │  └─ INSERT INTO stores (user_id, name, slug, ...)
│  │  │     • slug = slugify(storeName) + random_suffix
│  │  │     • Initialize with default layout & colors
│  │  │     • Default logo = placeholder image
│  │  │
│  │  ├─ Generate JWT tokens
│  │  │  ├─ Access Token (expires 15 minutes)
│  │  │  │  └─ Payload: { userId, storeId, iat, exp }
│  │  │  │     Signed with JWT_SECRET
│  │  │  │
│  │  │  └─ Refresh Token (expires 7 days)
│  │  │     └─ Payload: { userId, type: "refresh", iat, exp }
│  │  │        Stored in HTTP-only cookie or localStorage
│  │  │
│  │  └─ Return success response with tokens & user data
│  │
│  └─ Send JSON response (200 OK)
│     {
│       "status": "success",
│       "data": {
│         "user": {
│           "id": "uuid-12345",
│           "email": "merchant@example.com",
│           "store": {
│             "id": "store-uuid",
│             "name": "My Beautiful Store",
│             "slug": "my-beautiful-store-abc123"
│           }
│         },
│         "accessToken": "eyJhbGc...",
│         "refreshToken": "eyJhbGc..."
│       }
│     }
│
├─ REACT FRONTEND RECEIVES RESPONSE
│  │
│  ├─ Check response status
│  │
│  ├─ If error (status !== 200)
│  │  └─ Show error toast with message
│  │     Example: "Email already registered"
│  │     STOP
│  │
│  ├─ If success
│  │  ├─ Save tokens to localStorage
│  │  │  ├─ localStorage.setItem('accessToken', token)
│  │  │  └─ localStorage.setItem('refreshToken', token)
│  │  │
│  │  ├─ Dispatch Redux action: setAuth(user)
│  │  │  └─ Update Redux store with user data
│  │  │
│  │  ├─ Set Axios default header
│  │  │  └─ axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
│  │  │
│  │  ├─ Show success toast
│  │  │  └─ "Account created successfully!"
│  │  │
│  │  └─ Redirect to setup wizard
│  │     └─ navigate('/setup-wizard')
│  │
│  └─ Setup Wizard Page loads
│     ├─ Step 1: Select layout template
│     ├─ Step 2: Choose colors
│     ├─ Step 3: Upload logo
│     └─ Step 4: Basic store settings
│
└─ END: User ready to configure store

```

### B. User Login (Returning User)

```
┌─ User visits /auth/login
│
├─ LoginPage component renders
│  ├─ Email input field
│  └─ Password input field
│
├─ User enters credentials & clicks "Login"
│
├─ React Frontend Validation
│  ├─ Check email not empty
│  ├─ Check password not empty
│  └─ If invalid → Show error, STOP
│
├─ POST /api/auth/login
│  └─ Send { email, password }
│
├─ GOLANG BACKEND
│  │
│  ├─ Receive & validate request
│  │
│  ├─ Query user by email
│  │  └─ SELECT * FROM users WHERE email = ?
│  │
│  ├─ If user not found
│  │  └─ Return 401 Unauthorized: "Invalid email or password"
│  │
│  ├─ If user found
│  │  ├─ Compare password with hash
│  │  │  └─ bcrypt.CompareHashAndPassword(hash, password)
│  │  │
│  │  ├─ If password wrong
│  │  │  └─ Return 401: "Invalid email or password"
│  │  │
│  │  ├─ If password correct
│  │  │  ├─ Get user's store
│  │  │  │  └─ SELECT * FROM stores WHERE user_id = ? LIMIT 1
│  │  │  │
│  │  │  ├─ Generate new JWT tokens
│  │  │  │
│  │  │  └─ Return 200 OK with tokens & user data
│  │
│  └─ Response format same as registration
│
├─ REACT RECEIVES RESPONSE
│  │
│  ├─ Save tokens & user data (same as registration)
│  │
│  └─ Redirect to dashboard
│     └─ navigate('/admin/dashboard')
│
└─ END: User logged in & in dashboard

```

### C. Token Refresh Flow

```
┌─ User is logged in, making API requests
│
├─ Every API request includes Authorization header
│  └─ Authorization: Bearer <accessToken>
│
├─ Axios middleware intercepts response
│
├─ If response status === 401 (Unauthorized)
│  │
│  ├─ AccessToken sudah expired
│  │
│  ├─ POST /api/auth/refresh
│  │  └─ Send refreshToken
│  │
│  ├─ GOLANG validates refresh token
│  │  ├─ Verify JWT signature
│  │  ├─ Check expiration
│  │  └─ If valid → Generate new accessToken
│  │
│  ├─ Return new accessToken
│  │
│  ├─ React saves new token
│  │
│  ├─ Retry original request with new token
│  │
│  └─ Continue normal flow
│
├─ If refresh token also expired
│  │
│  ├─ Return 401: "Refresh token expired"
│  │
│  ├─ React redirects to login
│  │  └─ Clear localStorage
│  │     • Remove tokens
│  │     • Remove user data
│  │
│  └─ User must login again
│
└─ END: Token refresh complete

```

---

## 2️⃣ ALUR SETUP STORE & DESIGN CUSTOMIZATION

### Store Setup Wizard

```
┌─ User just registered → Redirected to setup wizard
│
├─ Setup Wizard Component loads
│  └─ currentStep state = 1
│
├─═ STEP 1: SELECT LAYOUT TEMPLATE ═─
│  │
│  ├─ Component: LayoutSelector.jsx
│  │  ├─ Displays 3-5 layout options
│  │  │  ├─ Layout A (Hero + Grid Products)
│  │  │  │  └─ Preview image/thumbnail
│  │  │  ├─ Layout B (Carousel + Featured)
│  │  │  │  └─ Preview image/thumbnail
│  │  │  ├─ Layout C (Minimal + Side Products)
│  │  │  │  └─ Preview image/thumbnail
│  │  │  └─ etc.
│  │  │
│  │  └─ Live preview panel on right side
│  │     └─ Shows selected layout in real-time
│  │
│  ├─ User clicks layout
│  │  └─ Update state: selectedLayout = 'layout_a'
│  │
│  ├─ Live preview updates immediately
│  │
│  └─ Click "Next"
│
├─═ STEP 2: CUSTOMIZE COLORS & THEME ═─
│  │
│  ├─ Component: ColorPicker.jsx
│  │  ├─ Color picker for primary color
│  │  │  └─ User clicks color input → Opens color picker UI
│  │  │
│  │  ├─ Color picker for secondary color
│  │  │
│  │  ├─ Color picker for accent/button color
│  │  │
│  │  └─ Live preview updates colors in real-time
│  │     └─ CSS variables update dynamically
│  │        :root {
│  │          --color-primary: #3B82F6;
│  │          --color-secondary: #1F2937;
│  │        }
│  │
│  ├─ User selects colors
│  │  └─ Update state: design.colorPrimary = '#3B82F6'
│  │
│  └─ Click "Next"
│
├─═ STEP 3: UPLOAD LOGO & BANNER ═─
│  │
│  ├─ Component: LogoUploader.jsx
│  │  ├─ Drag & drop area for logo
│  │  │  └─ User drags image or clicks to browse
│  │  │
│  │  ├─ File validation (client-side)
│  │  │  ├─ Check file type (jpg, png, svg)
│  │  │  ├─ Check file size (max 2MB)
│  │  │  └─ If invalid → Show error, don't proceed
│  │  │
│  │  ├─ If valid → Show preview
│  │  │
│  │  ├─ Upload file to backend
│  │  │  │
│  │  │  ├─ POST /api/files/upload (multipart/form-data)
│  │  │  │  └─ Send file buffer
│  │  │  │
│  │  │  ├─ GOLANG receives
│  │  │  │  ├─ Validate file again (server-side)
│  │  │  │  ├─ Generate unique filename
│  │  │  │  ├─ Save to MinIO/S3
│  │  │  │  │  └─ bucket: "storemaker-uploads"
│  │  │  │  │     folder: "stores/{storeId}/logos"
│  │  │  │  │
│  │  │  │  └─ Return public URL
│  │  │  │     {
│  │  │  │       "status": "success",
│  │  │  │       "data": {
│  │  │  │         "fileUrl": "https://cdn.storemaker.com/stores/uuid/logos/logo-123.png"
│  │  │  │       }
│  │  │  │     }
│  │  │  │
│  │  │  └─ React saves URL to state
│  │  │     └─ design.logoUrl = "https://cdn..."
│  │  │
│  │  └─ Live preview shows new logo
│  │
│  └─ Click "Next"
│
├─═ STEP 4: BASIC STORE SETTINGS ═─
│  │
│  ├─ Component: StoreSettingsForm.jsx
│  │  ├─ Store name input (already filled from registration)
│  │  ├─ Store tagline/subtitle input
│  │  ├─ Contact email
│  │  ├─ Contact phone
│  │  ├─ Address
│  │  ├─ Currency selection (IDR, USD, etc)
│  │  └─ Tax rate input (percentage)
│  │
│  ├─ User fills form
│  │
│  ├─ Click "Complete Setup"
│  │
│  ├─ React validates all form fields
│  │
│  ├─ If valid → Send all data to backend
│  │  │
│  │  └─ PUT /api/stores/{storeId}/design
│  │     {
│  │       "selectedLayout": "layout_a",
│  │       "colorPrimary": "#3B82F6",
│  │       "colorSecondary": "#1F2937",
│  │       "logoUrl": "https://cdn...",
│  │       "storeTagline": "Quality products...",
│  │       "contactEmail": "contact@store.com",
│  │       "currency": "IDR",
│  │       "taxRate": 10
│  │     }
│  │
│  ├─ GOLANG BACKEND
│  │  │
│  │  ├─ StoreHandler.UpdateDesign() starts
│  │  │
│  │  ├─ Validate all fields
│  │  │
│  │  ├─ Update stores table
│  │  │  └─ UPDATE stores SET
│  │  │       selectedLayout = ?,
│  │  │       colorPrimary = ?,
│  │  │       colorSecondary = ?,
│  │  │       logoUrl = ?
│  │  │     WHERE id = ?
│  │  │
│  │  ├─ Invalidate cache (if using Redis)
│  │  │
│  │  └─ Return success response
│  │
│  ├─ REACT RECEIVES SUCCESS
│  │  │
│  │  ├─ Show success toast: "Store configured!"
│  │  │
│  │  ├─ Update Redux storeSlice with new config
│  │  │
│  │  └─ Redirect to dashboard
│  │     └─ navigate('/admin/dashboard')
│  │
│  └─ Setup complete!
│
└─ END: Store fully configured & ready to add products

```

---

## 3️⃣ ALUR MANAJEMEN PRODUK

### Add Product

```
┌─ Admin in ProductListPage
│
├─ Click "Add New Product" button
│
├─ Modal/Form opens: ProductForm.jsx
│  ├─ Product name input
│  ├─ Product description (rich text editor)
│  ├─ Category dropdown
│  │  └─ GET /api/categories/{storeId}
│  │     • Already loaded in form
│  │     • Shows all categories for this store
│  │
│  ├─ SKU (Stock Keeping Unit)
│  ├─ Price input
│  ├─ Cost input (for profit calculation)
│  ├─ Initial stock quantity
│  ├─ Image upload (multiple)
│  │  ├─ Drag & drop images
│  │  ├─ Click to browse
│  │  └─ Show thumbnail preview
│  │
│  └─ Submit button
│
├─ User fills all fields
│
├─ Client-side validation
│  ├─ Product name not empty
│  ├─ Price valid number
│  ├─ Stock valid number
│  ├─ At least 1 image uploaded
│  └─ If invalid → Show field error, STOP
│
├─ If valid → Show loading spinner
│
├─ Upload images (loop through each)
│  │
│  ├─ For each image
│  │  │
│  │  ├─ POST /api/files/upload
│  │  │  └─ multipart/form-data with image
│  │  │
│  │  ├─ GOLANG receives
│  │  │  ├─ Validate file type & size
│  │  │  ├─ Save to MinIO/S3
│  │  │  │  └─ Path: stores/{storeId}/products/image-uuid.jpg
│  │  │  │
│  │  │  └─ Return URL
│  │  │
│  │  └─ React collects URL
│  │
│  └─ After all images: imageUrls = [url1, url2, url3]
│
├─ POST /api/stores/{storeId}/products
│  └─ Send product data with image URLs
│     {
│       "name": "Premium T-Shirt",
│       "description": "High quality cotton...",
│       "category": "clothing-uuid",
│       "sku": "TSH-001",
│       "price": 150000,
│       "cost": 80000,
│       "stock": 50,
│       "images": [
│         "https://cdn.../product-1.jpg",
│         "https://cdn.../product-2.jpg"
│       ]
│     }
│
├─ GOLANG BACKEND
│  │
│  ├─ ProductHandler.CreateProduct()
│  │
│  ├─ Validate all inputs
│  │
│  ├─ Check SKU not duplicate (within this store)
│  │  └─ SELECT * FROM products WHERE store_id = ? AND sku = ?
│  │     • If exists → Return error "SKU already exists"
│  │
│  ├─ Create product transaction (atomic)
│  │  ├─ INSERT INTO products (...)
│  │  │  └─ Generate new UUID for product
│  │  │
│  │  ├─ INSERT INTO inventory (...)
│  │  │  └─ Create inventory record with initial stock
│  │  │
│  │  ├─ INSERT INTO inventory_transactions (...)
│  │  │  └─ Log: "Initial stock: 50 units"
│  │  │
│  │  └─ All or nothing (transaction)
│  │
│  ├─ Invalidate product cache
│  │
│  └─ Return product ID & created product data
│     {
│       "status": "success",
│       "data": {
│         "id": "product-uuid",
│         "name": "Premium T-Shirt",
│         "sku": "TSH-001",
│         ...
│       }
│     }
│
├─ REACT RECEIVES SUCCESS
│  │
│  ├─ Close form modal
│  │
│  ├─ Show success toast: "Product added successfully!"
│  │
│  ├─ Refresh product list
│  │  └─ GET /api/stores/{storeId}/products?page=1
│  │
│  └─ New product appears in table
│
└─ END: Product created

```

---

## 4️⃣ ALUR SHOPPING CART & CHECKOUT

### Cart Management

```
┌─ Cart is stored in Redux + localStorage
│  └─ cart = [
│       { productId, name, price, quantity, image },
│       { productId, name, price, quantity, image }
│     ]
│
├─ Customer on CartPage (/store/cart)
│
├─ CartPage.jsx loads from Redux
│  └─ const cartItems = useSelector(state => state.cart.items)
│
├─ Displays:
│  ├─ Table/List of cart items
│  │  ├─ Product image
│  │  ├─ Product name
│  │  ├─ Unit price
│  │  ├─ Quantity input (editable)
│  │  ├─ Subtotal (price × quantity)
│  │  └─ Remove button
│  │
│  ├─ Cart summary box
│  │  ├─ Subtotal = SUM(price × quantity)
│  │  ├─ Shipping cost (if applicable)
│  │  ├─ Tax (if applicable)
│  │  └─ Total = Subtotal + Shipping + Tax
│  │
│  └─ "Proceed to Checkout" button
│
├─ If customer updates quantity
│  │
│  ├─ User changes quantity input
│  │
│  ├─ Dispatch: updateCartQuantity(productId, newQuantity)
│  │  └─ Redux updates:
│  │     ├─ Item quantity updated
│  │     ├─ Totals recalculated
│  │     ├─ localStorage updated
│  │     └─ Cart summary refreshes
│  │
│  └─ If quantity = 0 or user clicks remove
│     └─ Dispatch: removeFromCart(productId)
│        └─ Item removed from cart
│
├─ If customer clicks "Proceed to Checkout"
│  │
│  ├─ Validate cart not empty
│  │
│  └─ Navigate to CheckoutPage
│
└─ (Continue to checkout)

```

### Checkout Process

```
┌─ CheckoutPage.jsx loads
│
├─ Display in two columns
│  │
│  ├─ LEFT: Customer Information Form
│  │  ├─ Customer type selection
│  │  │  ├─ Radio: "Guest Checkout"
│  │  │  └─ Radio: "Login for saved addresses"
│  │  │
│  │  ├─ If guest checkout:
│  │  │  ├─ Full name input
│  │  │  ├─ Email input
│  │  │  ├─ Phone number input
│  │  │  ├─ Street address input
│  │  │  ├─ City dropdown/input
│  │  │  ├─ Province dropdown
│  │  │  ├─ Postal code input
│  │  │  └─ Notes (optional)
│  │  │
│  │  ├─ Shipping method selection
│  │  │  ├─ Regular (2-3 days) - Free
│  │  │  ├─ Express (1 day) - +Rp 50,000
│  │  │  └─ Overnight - +Rp 150,000
│  │  │  └─ On select: Update shipping cost in right panel
│  │  │
│  │  ├─ Payment method selection
│  │  │  ├─ Credit/Debit Card
│  │  │  ├─ Bank Transfer
│  │  │  ├─ E-wallet (GCash, OVO, Dana, etc)
│  │  │  └─ Store Credit (if available)
│  │  │
│  │  └─ Notes input (optional)
│  │
│  └─ RIGHT: Order Summary (Sticky)
│     ├─ List of cart items
│     │  ├─ Product name × quantity
│     │  └─ Price each
│     │
│     ├─ Subtotal
│     ├─ Shipping cost (dynamic based on selection)
│     ├─ Tax (if applicable)
│     ├─ Discount code input (optional)
│     │  └─ If code entered:
│     │     • Validate on backend
│     │     • Apply discount if valid
│     │     • Recalculate total
│     │
│     └─ TOTAL (bold, large)
│
├─ Client-side form validation
│  ├─ All required fields filled
│  ├─ Email valid format
│  ├─ Phone valid format
│  ├─ Cart not empty
│  ├─ Shipping method selected
│  ├─ Payment method selected
│  └─ If validation fails → Show field errors, STOP
│
├─ User clicks "Place Order"
│
├─ Show loading spinner ("Processing your order...")
│
├─ POST /api/stores/{storeId}/orders
│  └─ Send:
│     {
│       "items": [
│         { "productId": "uuid", "quantity": 2 },
│         { "productId": "uuid", "quantity": 1 }
│       ],
│       "customer": {
│         "name": "John Doe",
│         "email": "john@example.com",
│         "phone": "081234567890",
│         "address": "Jl. Example 123",
│         "city": "Jakarta",
│         "postalCode": "12345"
│       },
│       "shippingMethod": "regular",
│       "paymentMethod": "bank_transfer",
│       "notes": "Please handle with care"
│     }
│
├─ GOLANG BACKEND
│  │
│  ├─ OrderHandler.CreateOrder()
│  │
│  ├─ Validate all inputs
│  │
│  ├─ START DATABASE TRANSACTION (atomic)
│  │  │
│  │  ├─ For each item in order
│  │  │  │
│  │  │  ├─ GET product details
│  │  │  │  └─ SELECT * FROM products WHERE id = ?
│  │  │  │
│  │  │  ├─ Check if product exists
│  │  │  │
│  │  │  ├─ Check if stock available
│  │  │  │  ├─ IF stock < quantity → ROLLBACK, return error
│  │  │  │  │  "Insufficient stock for [product name]"
│  │  │  │  │
│  │  │  │  └─ ELSE continue
│  │  │  │
│  │  │  └─ Store product for later (don't query again)
│  │  │
│  │  ├─ Calculate totals
│  │  │  ├─ Subtotal = SUM(item.quantity × item.price)
│  │  │  ├─ Tax = Subtotal × tax_rate
│  │  │  ├─ Shipping = Calculate based on method
│  │  │  ├─ Discount = Validate coupon (if provided)
│  │  │  └─ Total = Subtotal + Tax + Shipping - Discount
│  │  │
│  │  ├─ Generate order reference number
│  │  │  └─ Format: "ORD-{timestamp}-{random}"
│  │  │     Example: "ORD-2024051912345-ABCD"
│  │  │
│  │  ├─ INSERT INTO orders
│  │  │  ├─ order_id (UUID)
│  │  │  ├─ reference_number
│  │  │  ├─ customer data
│  │  │  ├─ totals
│  │  │  ├─ status = "pending"
│  │  │  ├─ payment_status = "pending"
│  │  │  └─ created_at = NOW()
│  │  │
│  │  ├─ INSERT INTO order_items (for each item)
│  │  │  ├─ order_id
│  │  │  ├─ product_id
│  │  │  ├─ quantity
│  │  │  ├─ unit_price (capture current price)
│  │  │  └─ subtotal
│  │  │
│  │  ├─ UPDATE products SET stock = stock - quantity
│  │  │  └─ For each product in order
│  │  │
│  │  ├─ INSERT INTO inventory_transactions
│  │  │  └─ For each product:
│  │  │     {
│  │  │       "product_id": "uuid",
│  │  │       "type": "sold",
│  │  │       "quantity": -2,
│  │  │       "order_id": "order-uuid",
│  │  │       "created_at": NOW()
│  │  │     }
│  │  │
│  │  ├─ Check reorder levels
│  │  │  └─ For each product:
│  │  │     IF new_stock < reorder_level
│  │  │     THEN Queue email alert (async)
│  │  │
│  │  ├─ If customer email exists in customers table
│  │  │  └─ UPDATE customers SET
│  │  │       total_spent += order.total,
│  │  │       total_orders += 1
│  │  │
│  │  └─ If first time customer
│  │     └─ INSERT INTO customers (...)
│  │
│  ├─ COMMIT TRANSACTION
│  │  └─ All changes saved atomically
│  │
│  ├─ Queue email notification (async/background job)
│  │  └─ Subject: "Order Confirmation - {reference_number}"
│  │     Body: Order details, payment instructions, etc.
│  │
│  └─ Return 201 Created with order data
│     {
│       "status": "success",
│       "data": {
│         "orderId": "order-uuid",
│         "referenceNumber": "ORD-2024051912345-ABCD",
│         "totalAmount": 523000,
│         "paymentStatus": "pending",
│         "nextStep": "payment" // Redirect to payment page
│       }
│     }
│
├─ REACT RECEIVES SUCCESS
│  │
│  ├─ Clear cart
│  │  └─ Dispatch: clearCart()
│  │     ├─ Empty Redux cart
│  │     ├─ Clear localStorage
│  │     └─ Cart icon shows 0
│  │
│  ├─ Save order ID to state
│  │
│  ├─ Show success toast: "Order placed successfully!"
│  │
│  ├─ Redirect to payment page
│  │  └─ navigate(`/stores/{storeSlug}/payment/${orderId}`)
│  │
│  └─ (Continue to Payment flow)
│
└─ END: Order created, awaiting payment

```

---

## 5️⃣ ALUR PEMBAYARAN (PAYMENT FLOW)

### Payment Gateway Integration (Midtrans)

```
┌─ Customer redirected to PaymentPage
│  └─ /stores/{storeSlug}/payment/{orderId}
│
├─ PaymentPage.jsx loads
│
├─ GET /api/stores/{storeSlug}/orders/{orderId}
│  └─ GOLANG returns order details
│
├─ React renders payment page
│  ├─ Display order details
│  │  ├─ Reference number
│  │  ├─ Total amount: Rp 523,000
│  │  ├─ Items summary
│  │  └─ Customer info
│  │
│  └─ Payment button: "Pay Now with Midtrans Snap"
│
├─ POST /api/payments/create-transaction
│  └─ Send order ID to backend
│
├─ GOLANG BACKEND
│  │
│  ├─ PaymentHandler.CreateTransaction()
│  │
│  ├─ Get order details from database
│  │  └─ SELECT * FROM orders WHERE id = ?
│  │
│  ├─ Validate order status
│  │  ├─ IF already paid → Return error "Order already paid"
│  │  └─ ELSE continue
│  │
│  ├─ Call Midtrans Snap API
│  │  ├─ Build request with order details
│  │  └─ Call: coreapi.ChargeTransaction(snapReq)
│  │     └─ Midtrans API responds with transaction token
│  │        {
│  │          "token": "80111...long token...",
│  │          "redirect_url": "https://app.sandbox.midtrans.com/snap/v2/...",
│  │          "transaction_id": "0712aba9-0ae3-4a8b-bd4f-12cec0e44ec9"
│  │        }
│  │
│  ├─ INSERT INTO payment_transactions
│  │  {
│  │    "order_id": "order-uuid",
│  │    "midtrans_transaction_id": "0712aba9...",
│  │    "amount": 523000,
│  │    "status": "pending"
│  │  }
│  │
│  └─ Return response to React with snapToken
│
├─ REACT RECEIVES SNAP TOKEN
│  │
│  ├─ Load Midtrans Snap.js library
│  │  └─ <script src="https://app.sandbox.midtrans.com/snap/snap.js"></script>
│  │
│  ├─ Initialize Snap
│  │  └─ window.snap.pay(snapToken, callbacks)
│  │
│  └─ Snap UI opens (modal/popup)
│     └─ Shows payment methods
│
├─ Customer completes payment via Snap
│
├─ Midtrans processes payment & sends WEBHOOK
│  └─ POST /api/payments/webhook
│     {
│       "transaction_id": "0712aba9-0ae3-4a8b-bd4f-12cec0e44ec9",
│       "order_id": "ORD-2024051912345-ABCD",
│       "transaction_status": "settlement",
│       "payment_type": "credit_card",
│       "gross_amount": "523000.00"
│     }
│
├─ GOLANG RECEIVES WEBHOOK
│  │
│  ├─ PaymentHandler.HandleMidtransWebhook()
│  │
│  ├─ Verify webhook signature
│  │  └─ IF signature invalid → Return 401, STOP
│  │
│  ├─ IF transaction_status = "settlement" (success):
│  │  │
│  │  ├─ UPDATE payment_transactions SET status = "completed"
│  │  ├─ UPDATE orders SET payment_status = "completed", status = "processing"
│  │  ├─ Queue email: Order Confirmation & Invoice
│  │  ├─ Update customer total_spent
│  │  │
│  │  └─ Return 200 OK to Midtrans
│  │
│  └─ IF transaction_status = "deny/cancel" (failed):
│     └─ UPDATE payment_status = "failed"
│
├─ REACT meanwhile...
│  │
│  ├─ From onSuccess callback or polling
│  │  └─ Detect payment_status changed to "completed"
│  │
│  ├─ Show success page
│  │  └─ "Payment Successful!"
│  │     ├─ Order details
│  │     ├─ Download invoice button
│  │     ├─ Track order button
│  │     └─ Back to store button
│  │
│  └─ Navigate to success page
│
└─ END: Payment process complete

```

---

## 6️⃣ ALUR MANAJEMEN ORDER (ADMIN)

```
┌─ Admin opens OrderListPage (/admin/orders)
│
├─ GET /api/stores/{storeId}/orders?page=1&limit=20
│  └─ GOLANG returns paginated orders
│
├─ React displays OrderTable with:
│  ├─ Reference number (link to detail)
│  ├─ Customer name
│  ├─ Total amount
│  ├─ Order status (badge: Pending/Processing/Shipped/Completed)
│  ├─ Payment status (badge: Pending/Completed)
│  ├─ Created date
│  └─ Actions (View, Edit, Print, Delete)
│
├─ Admin clicks order → OrderDetailPage
│  └─ Shows:
│     ├─ Order header info
│     ├─ Customer details
│     ├─ Order items table
│     ├─ Summary (Subtotal, Tax, Shipping, Total)
│     ├─ Status change dropdown
│     ├─ Actions (Generate invoice, print, refund, etc)
│     └─ Event timeline
│
├─ Admin changes order status (e.g., to "Shipped")
│  │
│  ├─ Selects "Shipped"
│  ├─ Modal opens for shipment details
│  │  ├─ Courier selection (JNE, Pos, etc)
│  │  ├─ Tracking number input
│  │  └─ "Send update to customer" checkbox
│  │
│  ├─ PUT /api/stores/{storeId}/orders/{orderId}
│  │  └─ Send status change with tracking info
│  │
│  ├─ GOLANG
│  │  ├─ OrderHandler.UpdateOrderStatus()
│  │  ├─ UPDATE orders table
│  │  ├─ INSERT INTO order_events (audit log)
│  │  ├─ IF sendNotification=true → Queue customer email
│  │  │  └─ Email includes: Tracking # + link to carrier
│  │  │
│  │  └─ Return updated order
│  │
│  ├─ REACT
│  │  ├─ Show success toast
│  │  ├─ Update order status badge
│  │  └─ Timeline adds new event
│  │
│  └─ END: Order status updated
│
└─ Admin can also refund, print packing slip, etc.

```

---

## 7️⃣ ALUR INVENTORY & STOCK MANAGEMENT

```
┌─ Stock automatically decremented when order is paid
│
├─ Admin opens InventoryPage (/admin/inventory)
│
├─ GET /api/stores/{storeId}/inventory
│  └─ Returns all products with stock levels
│
├─ React displays:
│  ├─ Summary cards (Total products, In stock, Low stock, Out of stock)
│  ├─ Inventory table with:
│  │  ├─ Product image & name
│  │  ├─ SKU
│  │  ├─ Current stock
│  │  ├─ Reorder level
│  │  ├─ Status badge (In stock/Low/Out)
│  │  └─ Actions (View history, Adjust stock)
│  │
│  └─ Filters (by status, category, search)
│
├─ Admin clicks "View History"
│  │
│  ├─ GET /api/products/{productId}/inventory-history
│  │
│  └─ Shows transaction history:
│     ├─ Date | Type | Quantity | Balance | Order/Reason
│     └─ Example: 2024-05-20 10:30 | Sold | -2 | 48 | ORD-12345
│
├─ Admin clicks "Adjust Stock"
│  │
│  ├─ Modal: StockAdjustmentModal
│  │  ├─ New quantity or adjustment amount input
│  │  ├─ Reason dropdown (Discrepancy, Damaged, Return, etc)
│  │  └─ Notes textarea
│  │
│  ├─ POST /api/products/{productId}/adjust-stock
│  │  └─ Send: { adjustment, reason, notes }
│  │
│  ├─ GOLANG
│  │  ├─ ProductHandler.AdjustStock()
│  │  ├─ UPDATE products SET stock = ?
│  │  ├─ INSERT INTO inventory_transactions
│  │  │  └─ Log: type="adjusted", quantity=-5, reason=...
│  │  │
│  │  ├─ IF new_stock < reorder_level
│  │  │  └─ Queue low-stock alert email
│  │  │
│  │  └─ Return updated inventory
│  │
│  ├─ REACT
│  │  ├─ Close modal
│  │  ├─ Show success toast
│  │  ├─ Update product row
│  │  └─ Status badge updates if now low-stock
│  │
│  └─ END: Stock adjusted
│
└─ Low-stock alerts sent automatically to store owner

```

---

## 8️⃣ ALUR ANALYTICS & REPORTING

```
┌─ Admin opens AnalyticsPage (/admin/analytics)
│
├─ GET /api/stores/{storeId}/analytics/summary?period=month
│
├─ GOLANG aggregates data from orders table:
│  ├─ Total Revenue: SUM(total_amount) WHERE status='paid'
│  ├─ Order Count: COUNT(DISTINCT id) WHERE status='paid'
│  ├─ Avg Order Value: AVG(total_amount)
│  ├─ Daily sales trend: GROUP BY DATE
│  ├─ Revenue by category: GROUP BY category
│  └─ Top products: SUM(quantity) ORDER BY qty DESC
│
├─ React displays AnalyticsDashboard:
│  │
│  ├─ Period selector (Week/Month/Quarter/Year)
│  │
│  ├─ Metric cards:
│  │  ├─ Total Revenue (Rp 5,234,000) + trend
│  │  ├─ Total Orders (87) + trend
│  │  ├─ Avg Order Value (Rp 60,103) + trend
│  │  └─ Conversion Rate (3.2%)
│  │
│  ├─ Sales Trend chart (line chart)
│  │  └─ X-axis: Dates, Y-axis: Sales amount
│  │
│  ├─ Revenue by Category (pie chart)
│  │  └─ Shows breakdown by product category
│  │
│  ├─ Top Products table
│  │  └─ Rank | Product | Units Sold | Revenue
│  │
│  └─ Export button (CSV/PDF)
│
├─ Admin selects different period
│  └─ All charts update with new data
│
└─ END: Analytics viewed

```

---

## 9️⃣ ALUR EMAIL & NOTIFICATION

```
┌─ Various events trigger automated emails

├─ ORDER CONFIRMATION (after order created)
│  ├─ Async email job starts
│  ├─ Email: Order details, payment instructions
│  ├─ To: customer email
│  └─ Logged in notification_logs table
│
├─ PAYMENT CONFIRMATION (after payment received)
│  ├─ Email: Payment received, transaction ID
│  ├─ To: customer email
│  └─ Next: Order status updates to "processing"
│
├─ SHIPMENT UPDATE (when marked as shipped)
│  ├─ IF admin selected "Send to customer"
│  ├─ Email: Tracking number + carrier link
│  └─ To: customer email
│
├─ LOW STOCK ALERT (when stock < reorder_level)
│  ├─ Email to: store owner
│  ├─ Content: Product name, current stock, suggested order qty
│  └─ Link to inventory dashboard
│
└─ WELCOME EMAIL (on user registration)
   ├─ Welcome message
   ├─ Email confirmation link
   ├─ Quick start guide
   └─ Contact support link

```

---

## 🔟 FULL SYSTEM FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                        STOREMAKER COMPLETE FLOW                       │
└─────────────────────────────────────────────────────────────────────┘

START
 │
 ├─→ User Registration & Setup Store
 │    ├─ Email verification
 │    ├─ Create default store
 │    ├─ Select layout & customize design
 │    └─ Store ready
 │
 ├─→ Admin: Product Management
 │    ├─ Add products (name, price, stock, images)
 │    ├─ Organize by categories
 │    └─ Products visible on public store
 │
 ├─→ Customer: Shopping
 │    ├─ Visit public store
 │    ├─ Browse products
 │    ├─ Add items to cart
 │    ├─ Proceed to checkout
 │    └─ Cart cleared
 │
 ├─→ Order & Inventory
 │    ├─ Create order
 │    ├─ Deduct inventory
 │    ├─ Send order confirmation email
 │    └─ Order pending payment
 │
 ├─→ Payment Processing
 │    ├─ Midtrans payment gateway
 │    ├─ Customer completes payment
 │    ├─ Webhook confirms payment
 │    ├─ Order status → "Processing"
 │    └─ Send payment confirmation email
 │
 ├─→ Admin: Fulfillment
 │    ├─ View pending orders
 │    ├─ Pack items
 │    ├─ Mark as shipped with tracking
 │    └─ Send shipment email to customer
 │
 ├─→ Inventory Management
 │    ├─ Track stock levels
 │    ├─ Low stock alerts
 │    ├─ Manual adjustments with audit trail
 │    └─ Historical tracking
 │
 ├─→ Analytics & Reporting
 │    ├─ View sales trends
 │    ├─ Top products analysis
 │    ├─ Customer insights
 │    └─ Export reports
 │
 └─→ Ongoing Operations
      ├─ Handle returns/refunds
      ├─ Customer communication
      ├─ Marketing (email campaigns - future)
      └─ Store growth & scaling

```

---

## Summary

Dokumentasi ini mencakup **100% alur kerja sistem StoreMaker** dengan detail lengkap:

1. **Authentication & Authorization** - Complete registration, login, token refresh flow
2. **Store Setup** - Multi-step wizard dengan preview real-time
3. **Product Management** - CRUD operations dengan image upload & inventory
4. **Shopping Experience** - Cart, checkout, order creation dengan validasi
5. **Payment Integration** - Midtrans Snap dengan webhook handling
6. **Order Management** - Admin dashboard dengan status tracking & timeline
7. **Inventory** - Real-time stock tracking dengan audit trail
8. **Analytics** - Dashboard metrics dengan charts & export
9. **Notifications** - Automated emails untuk berbagai events
10. **System Integration** - Complete end-to-end flow dari signup hingga delivery

**Setiap workflow menjelaskan:**
- Client-side (React) validation & actions
- Server-side (Golang) processing & database operations
- Request/response payload contoh
- Error handling & edge cases
- Data persistence & state management

Database schema bisa ditambahkan belakangan sesuai kebutuhan. Dokumentasi ini fokus pada **cara sistem bekerja secara komprehensif dari perspektif user & developer.**