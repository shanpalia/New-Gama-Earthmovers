import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  MessageSquare, 
  CheckCircle2, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { formatPrice, generateWhatsAppUrl } from '../utils/formatters';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    cartTotal, 
    currency, 
    setCurrency, 
    setCustomerTab, 
    setSelectedPart,
    setIsCheckoutOpen,
    shopSettings 
  } = useShop();

  if (cart.length === 0) {
    return (
      <div className="py-20 px-4 max-w-3xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-5 text-slate-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase font-mono tracking-tight">
          Your Parts Cart Is Empty
        </h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2 mb-8">
          You have not added any heavy equipment spare parts to your cart yet. Browse our inventory to select OEM parts for your machinery.
        </p>
        <button
          onClick={() => setCustomerTab('parts')}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wide rounded-xl shadow-lg transition-all"
        >
          Buy Products
        </button>
      </div>
    );
  }

  const handleWhatsAppOrderAssistance = () => {
    if (!shopSettings) return;
    const itemsList = cart.map(it => `• ${it.part.name} (Part #${it.part.partNumber}) x ${it.quantity}`).join('\n');
    const msg = `Hello ${shopSettings.shopName || 'New Gama Earthmovers'},

I have selected the following heavy equipment parts in my cart:

${itemsList}

Selected Currency: ${currency}
Total Value: ${formatPrice(cartTotal, currency)}

Please assist me with instant order confirmation and dispatch schedule.`;

    const url = generateWhatsAppUrl(shopSettings.whatsappNumber, msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => setCustomerTab('parts')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-bold mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Buy More Products</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-tight">
            Heavy Parts Shopping Cart ({cart.reduce((acc, it) => acc + it.quantity, 0)} Items)
          </h1>
        </div>

        {/* Currency Preference Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-400 px-2">Currency:</span>
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              currency === 'INR' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇮🇳 INR (₹)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('NPR')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              currency === 'NPR' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇳🇵 NPR (रु)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const unitPrice = currency === 'NPR' ? item.part.sellingPriceNpr : item.part.sellingPriceInr;
            const itemTotal = unitPrice * item.quantity;
            const img = (item.part.images && item.part.images[0]) || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={item.partId}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
              >
                {/* Part Image & Info */}
                <div 
                  className="flex items-center gap-4 cursor-pointer group flex-1"
                  onClick={() => {
                    setSelectedPart(item.part);
                    setCustomerTab('part-detail');
                  }}
                >
                  <img
                    src={img}
                    alt={item.part.name}
                    className="w-20 h-20 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        PART #{item.part.partNumber}
                      </span>
                      <span className="text-xs text-slate-400">{item.part.compatibleMachine}</span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {item.part.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Unit: {formatPrice(unitPrice, currency)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  
                  {/* Stepper */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.partId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-800 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.partId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-800 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[100px]">
                    <span className="text-base font-black text-amber-400 font-mono">
                      {formatPrice(itemTotal, currency)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.partId)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-slate-500 hover:text-rose-400 underline transition-colors"
            >
              Clear Entire Cart
            </button>
            <button
              type="button"
              onClick={() => setCustomerTab('parts')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              + Buy More Products
            </button>
          </div>
        </div>

        {/* Billing Summary Box (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-28 space-y-6">
            
            <h2 className="text-lg font-black text-white uppercase font-mono tracking-tight pb-3 border-b border-slate-800">
              Billing Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Parts Subtotal</span>
                <span className="text-white font-mono font-bold">{formatPrice(cartSubtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery</span>
                <span className="text-emerald-400 font-bold">Shop Pickup Only</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Currency Applied</span>
                <span className="text-amber-400 font-bold">{currency === 'NPR' ? '🇳🇵 Nepalese Rupee (NPR)' : '🇮🇳 Indian Rupee (INR)'}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-white uppercase font-mono">Total Amount</span>
                <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                  {formatPrice(cartTotal, currency)}
                </span>
              </div>
            </div>

            {/* Main Checkout Button */}
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-amber-500/20 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Proceed To Place Order</span>
            </button>

            {/* WhatsApp Direct Assistance */}
            <button
              type="button"
              onClick={handleWhatsAppOrderAssistance}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all border border-emerald-500/30"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Instant Order Via WhatsApp</span>
            </button>

            {/* Assurances */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Orders confirmed in real-time by warehouse staff</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Direct road & transport booking across India & Nepal</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
