import { useState } from "react";
import { X, Copy, Check, Smartphone, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PaymentModalProps {
  planName: string;
  planPrice: string;
  onClose: () => void;
  onSuccess: () => void;
}

const UPI_ID = "kotak0407mgs@ybl";

const PAYMENT_APPS = [
  {
    name: "Google Pay",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",
    color: "from-blue-600 to-blue-400",
    scheme: "gpay://upi/",
  },
  {
    name: "PhonePe",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",
    color: "from-purple-600 to-indigo-500",
    scheme: "phonepe://",
  },
  {
    name: "Paytm",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png",
    color: "from-blue-500 to-cyan-400",
    scheme: "paytmmp://",
  },
];

export function PaymentModal({ planName, planPrice, onClose, onSuccess }: PaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = UPI_ID;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaymentApp = (scheme: string) => {
    const priceNum = planPrice.replace(/[^\d]/g, "");
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=AKPLAY&am=${priceNum}&cu=INR&tn=AKPLAY ${planName} Plan`;
    window.open(upiUrl, "_blank");
  };

  const handleConfirmPayment = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      onSuccess();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E62429] to-orange-500 p-6 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white">Complete Your Payment</h2>
            <p className="text-white/80 text-sm mt-1">
              {planName} Plan — <span className="font-bold text-white">{planPrice}/month</span>
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* QR Code */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <QrCode className="w-5 h-5 text-[#E62429]" />
                <h3 className="font-bold text-white">Scan QR Code to Pay</h3>
              </div>
              <div className="inline-block bg-white rounded-2xl p-3 shadow-2xl">
                <img
                  src="/qrcode.jpeg"
                  alt="Payment QR Code"
                  className="w-52 h-52 md:w-56 md:h-56 object-contain"
                />
              </div>
            </div>

            {/* UPI ID */}
            <div className="glass-card rounded-2xl p-4">
              <p className="text-gray-400 text-xs font-medium mb-2 text-center uppercase tracking-wider">
                Or pay using UPI ID
              </p>
              <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                <code className="text-white font-mono text-sm tracking-wide">{UPI_ID}</code>
                <button
                  onClick={handleCopyUPI}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#E62429] hover:text-[#ff333a] transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Payment App Buttons */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-[#E62429]" />
                <h3 className="font-bold text-white text-sm">Pay with UPI App</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_APPS.map((app) => (
                  <button
                    key={app.name}
                    onClick={() => handlePaymentApp(app.scheme)}
                    className={`flex flex-col items-center gap-2 glass-btn rounded-2xl p-4 hover:bg-white/10 transition-all group`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} p-[1px] flex items-center justify-center overflow-hidden`}>
                      <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex items-center justify-center p-2">
                        <img src={app.icon} alt={app.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-white text-xs font-semibold transition-colors">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={confirming}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/30 text-white py-4 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
            >
              {confirming ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying Payment...
                </span>
              ) : (
                "I've Completed the Payment ✓"
              )}
            </button>

            <p className="text-gray-500 text-xs text-center">
              After completing payment, click the button above to activate your subscription.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
