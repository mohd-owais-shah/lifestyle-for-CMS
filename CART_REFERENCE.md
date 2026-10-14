# Lifestyle Stores Cart Reference Checklist

This document details the layout, behaviors, and UI patterns observed on the live Lifestyle Stores cart page (`https://www.lifestylestores.com/in/en/cart`) across Desktop (1440px), Tablet (768px), and Mobile (390px) breakpoints.

Reference screenshots are saved in `/cart-reference`:
- `desktop-1440.png` (Desktop 1440x900)
- `tablet-768.png` (Tablet 768x1024)
- `mobile-390.png` (Mobile 390x844)

---

## Feature Checklist

| Feature | Status | Description & Behavior |
| :--- | :--- | :--- |
| **Responsive Grid Layout** | **FOUND** | **Desktop (1440px)**: 2-column layout (left ~65% for cart items, right ~35% for coupon code and price breakdown).<br>**Tablet (768px)**: Flexible stacked/2-column container.<br>**Mobile (390px)**: Single-column vertical stack with fixed bottom checkout bar. |
| **Line Item Image & Details** | **FOUND** | Product image with aspect ratio ~3:4 / 1:1, brand name in bold uppercase, product title, and variant tags (Size, Color). |
| **Pricing & Discount Display** | **FOUND** | Current selling price in bold black/charcoal (`₹...`), original MRP in strike-through gray, and percentage off badge (e.g., `40% OFF`). |
| **Quantity Controls** | **FOUND** | Stepper control (`-` / `+`) with quantity display. Minimum quantity 1. Prevents decrementing below 1 without explicit remove action. Optimistic feedback while updating. |
| **Remove Item** | **FOUND** | Dedicated "Remove" button per line item to delete from cart. |
| **Move to Wishlist / Save for Later** | **FOUND** | "Move to Wishlist" link alongside "Remove" on line items. |
| **Coupon / Promo Code Box** | **FOUND** | Input field with "Apply" button. Displays clear feedback message on invalid code (`applicable: false`), and tag with "Remove" button when valid coupon is applied. |
| **Automatic Discounts** | **FOUND** | Displayed per line item (strike-through original price with discounted unit/line total) and in order summary as discount rows. |
| **Order Summary ("Price Details")** | **FOUND** | Clear breakdown card showing:<br>- Total MRP / Subtotal<br>- Discount on MRP<br>- Coupon Discount (if applied)<br>- Delivery Fee (Free over threshold)<br>- Total Payable Amount |
| **"You Save" Callout** | **FOUND** | Prominent green/highlight badge displaying total savings across all line item and cart-level discounts. |
| **Free Delivery Progress** | **FOUND** | Visual progress indicator showing amount remaining to qualify for free shipping. |
| **Delivery Pincode Check** | **FOUND** | Pincode input box with "Check" action to verify delivery availability and estimated delivery speed. |
| **Empty Cart State** | **FOUND** | "Your Shopping Basket" heading, minimalist shopping bag illustration, headline *"The best fashion is waiting to be added in your cart !"*, subtext, department navigation pills, and continue shopping CTA. |
| **Sticky Mobile Checkout Bar** | **FOUND** | Fixed at bottom of viewport on mobile (390px), displaying total amount on left and high-contrast Checkout button on right. |

---

## Styling & UX Principles to Implement

1. **Clean Brand Palette**:
   - Primary Accent: Lifestyle warm amber/orange (`#FAA619` / `#E65100`).
   - Text: Charcoal/black `#1F2937` for titles/totals, neutral `#6B7280` for secondary labels and strike-through pricing.
   - Highlights: Green `#16A34A` for discounts, savings callouts, and free delivery notices.
   - Backgrounds: Clean white cards `#FFFFFF` on subtle soft gray `#F9FAFB` page background.

2. **Hydrogen Best Practices**:
   - Official `CartForm` mutations for `LinesUpdate`, `LinesRemove`, `DiscountCodesUpdate`.
   - `useOptimisticCart` for instant zero-latency UI updates without jarring layout shifts.
   - Official `@shopify/hydrogen` `Money` and `Image` components for localized currency formatting and responsive images.
   - Direct link to `cart.checkoutUrl` on checkout CTA.
