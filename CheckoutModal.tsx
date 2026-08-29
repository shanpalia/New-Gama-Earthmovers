import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  MessageSquare, 
  ShoppingBag, 
  Sparkles,
  FileText,
  Phone,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatPrice, generateOrderWhatsAppMessage } from '../utils/formatters';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    currency, 
    setCurrency, 
    createOrder, 
    customer, 
    setCustomer, 
    shopSettings,
    setCustomerTab
  } = useShop();

  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [whatsapp, setWhatsapp] = useState(customer?.whatsapp || customer?.phone || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [city, setCity] = useState(customer?.city || '');
  const [state, setState] = useState(customer?.state || '');
  const [country: 'India', setCountry] = useState<'India' | 'Nepal' | 'Other'>(customer?.country || (currency === 'NPR' ? 'Nepal' : 'India'));
  const [pinCode, setPinCode] = useState(customer?.pinCode || '');
  const [orderNotes, setOrderNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Sync country change to currency suggestion
  const handleCountryChange = (newCountry: 'India' | 'Nepal' | 'Other') => {
    setCountry(newCountry);
    if (newCountry === 'Nepal') {
      setCurrency('NPR');
    } else if (newCountry === 'India') {
      setCurrency('INR');
    }
  };

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setWhatsapp(customer.whatsapp || customer.phone);
      setEmail(customer.email || '');
      setAddress(customer.address || '');
      setCity(customer.city || '');
      setState(customer.state || '');
      setCountry(customer.country || 'India');
      setPinCode(customer.pinCode || '');
    }
  }, [customer]);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in Customer Name and Mobile Number.');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerWhatsapp: (whatsapp.trim() || phone.trim()),
      customerEmail: email.trim(),
      deliveryAddress: 'SHOP PICKUP ONLY',
      city: '',
      state: '',
      country: 'India',
      pinCode: '',
      currency,
      items: cart.map(item => ({
        partId: item.partId,
        partName: item.part.name,
        partNumber: item.part.partNumber,
        partImage: item.part.images && item.part.images[0] ? item.part.images[0] : '',
        quantity: item.quantity,
        unitPrice: currency === 'NPR' ? item.part.sellingPriceNpr : item.part.sellingPriceInr,
      })),
      orderNotes: orderNotes.trim()
    };

    const newOrder = await createOrder(orderPayload);
    setIsSubmitting(false);

    if (newOrder) {
      setCreatedOrder(newOrder);
      // Save customer profile in context
      setCustomer({
        id: `cust-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        email: email.trim(),
        country: 'India',
        address: address.trim(),
        city: '',
        state: '',
        pinCode: '',
        preferredCurrency: currency,
        createdAt: new Date().toISOString(),
      });

      // Confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // silent
      }
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCreatedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase font-mono tracking-tight">
                {createdOrder ? 'Order Confirmation Receipt' : 'Proceed to Checkout'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {createdOrder ? `Order ID: #${createdOrder.id}` : 'Review your billing summary and place a shop pickup order'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {createdOrder ? (
            /* SUCCESS RECEIPT VIEW */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase">
                  Order Successfully Registered
                </span>
                <h3 className="text-2xl font-black text-white font-mono mt-2">
                  ORDER #{createdOrder.id}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Thank you, <strong className="text-white">{createdOrder.customerName}</strong>. Your order has been received and is being prepared for shop pickup.
                </p>
              </div>

              {/* Order summary box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-semibold">Order Status</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold uppercase font-mono">
                    {createdOrder.orderStatus}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-400 font-semibold">Ordered Items ({createdOrder.items.length}):</span>
                  {createdOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300">
                      <span>• {it.partName} x {it.quantity}</span>
                      <span className="font-mono">{formatPrice(it.totalPrice, createdOrder.currency)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold">
                  <span className="text-slate-200">Total Payable:</span>
                  <span className="text-base text-amber-400 font-mono">
                    {formatPrice(createdOrder.totalAmount, createdOrder.currency)}
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-slate-400">
                  <strong>Order Type:</strong> Shop Pickup Only
                </div>
              </div>

              {/* WhatsApp Notification Button for Shop Owner */}
              {shopSettings && (
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${shopSettings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                      generateOrderWhatsAppMessage(
                        createdOrder.id,
                        createdOrder.customerName,
                        createdOrder.totalAmount,
                        createdOrder.currency,
                        shopSettings
                      )
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Notify Shop Owner on WhatsApp</span>
                  </a>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setCustomerTab('orders');
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700"
                >
                  View My Order History
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setCustomerTab('parts');
                  }}
                  className="px-5 py-2.5 bg-amber-500 text-slate-950 text-xs font-black rounded-lg"
                >
                  Buy More Products
                </button>
              </div>

            </div>
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* Billing Summary */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase">Billing Summary</h3>
                    <p className="text-[11px] text-slate-400">Review all products before placing your pickup order.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsCheckoutOpen(false); setCustomerTab('parts'); }}
                    className="text-[11px] font-bold text-amber-400 hover:text-amber-300"
                  >
                    + Buy More
                  </button>
                </div>
                <div className="space-y-2">
                  {cart.map(item => {
                    const unitPrice = currency === 'NPR' ? item.part.sellingPriceNpr : item.part.sellingPriceInr;
                    return (
                      <div key={item.partId} className="flex justify-between gap-3 text-xs">
                        <span className="text-slate-300 flex-1">{item.part.name} × {item.quantity}</span>
                        <span className="text-white font-mono font-bold whitespace-nowrap">{formatPrice(unitPrice * item.quantity, currency)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-800">
                  <span className="text-sm font-black text-white">Grand Total</span>
                  <span className="text-lg font-black text-amber-400 font-mono">{formatPrice(cartTotal, currency)}</span>
                </div>
                <p className="text-[11px] text-amber-300">📍 Pickup method: Shop Pickup Only</p>
              </div>

              {/* Order Cart mini summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{cart.length} Parts in Order</p>
                  <p className="text-base font-black text-amber-400 font-mono">
                    Total: {formatPrice(cartTotal, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Currency Applied:</span>
                  <span className="text-xs font-bold text-white font-mono">{currency}</span>
                </div>
              </div>

              {/* Pickup Order Notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-black text-amber-300">SHOP PICKUP ONLY</h3>
                    <p className="text-xs text-slate-300 mt-1">No delivery address is required. After placing the order, please collect your products directly from the shop.</p>
                  </div>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  1. Contact Information *
                </label>
                
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Customer / Company / Contractor Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Primary Mobile Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="WhatsApp Number (for dispatch tracking)"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address (Optional - for invoice PDF)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  2. Pickup Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Example: Please keep the order ready for pickup"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-xl hover:shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering Order in Database...</span>
                  ) : (
                    <>
                      <span>CONFIRM & PLACE HEAVY PARTS ORDER</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  No advance payment gateway required. Our inventory manager will verify compatibility and confirm dispatch.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
