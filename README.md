# Shopping App Wireframe Prototype

## File Structure
- `style.css`: Shared wireframe styling for all screens.
- `app.js`: Shared behavior (menu navigation, cart localStorage state, qty controls, checkout flow).
- `index.html`: Home / cart-empty entry screen.
- `menu.html`: Base menu overlay.
- `menu-shop.html`: SHOP expanded menu overlay.
- `menu-sale.html`: SALE expanded menu overlay.
- `tops.html`: Item list screen.
- `product.html`: Item detail screen with size-required add-to-cart.
- `added.html`: Added-to-cart modal state.
- `cart.html`: Filled cart screen with quantity and subtotal updates.
- `checkout.html`: Transaction + shipping + payment wireframe.
- `confirmed.html`: Order confirmation modal state (clears cart).

## How To Run
1. Open `index.html` in any browser.
2. Navigate through the prototype using links and buttons.
3. Cart state is stored in `localStorage` under key `proto_cart_v1`.

## Notes
- This is a no-framework, front-end-only clickable prototype.
- Visual style is intentionally wireframe-polished (white/black/gray, minimal accent colors).
