import { useState } from "react";
import { X, Copy, Check, Smartphone, QrCode, ArrowUpCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PaymentModalProps {
  planName: string;
  planPrice: string;
  onClose: () => void;
  onSuccess: () => void;
  isUpgrade?: boolean;
}

const UPI_ID = "kotak0407mgs@ybl";

const PAYMENT_APPS = [
  {
    name: "Google Pay",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",
    color: "from-blue-600 to-blue-400",
  },
  {
    name: "PhonePe",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",
    color: "from-purple-600 to-indigo-500",
  },
  {
    name: "Paytm",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png",
    color: "from-blue-500 to-cyan-400",
  },
];

export function PaymentModal({ planName, planPrice, onClose, onSuccess, isUpgrade }: PaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"pay" | "verify">("pay");

  const priceNum = planPrice.replace(/[^\d]/g, "");

  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent("AKPLAY")}&am=${encodeURIComponent(priceNum)}&cu=INR&tn=${encodeURIComponent(`AKPLAY ${planName} Plan`)}`;

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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

  const handleOpenUPI = () => {
    window.location.href = upiUrl;
  };

  const handleVerify = () => {
    const trimmed = transactionId.trim();
    if (!trimmed) {
      setError("Please enter your UPI Transaction ID / UTR number.");
      return;
    }
    if (trimmed.length < 8) {
      setError("Transaction ID seems too short. Please enter the full UTR/Reference number.");
      return;
    }

    setError("");
    setVerifying(true);

    // Store the transaction reference for admin review
    const pendingPayments = JSON.parse(localStorage.getItem("akplay-pending-payments") || "[]");
    pendingPayments.push({
      id: Date.now().toString(),
      transactionId: trimmed,
      plan: planName,
      amount: planPrice,
      date: new Date().toISOString(),
      status: "pending-verification",
    });
    localStorage.setItem("akplay-pending-payments", JSON.stringify(pendingPayments));

    // For now, accept the payment after transaction ID is provided
    // In production, this would verify with the payment gateway
    setTimeout(() => {
      setVerifying(false);
      onSuccess();
    }, 2000);
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
            <h2 className="text-xl font-bold text-white">
              {isUpgrade ? "Upgrade Your Plan" : "Complete Your Payment"}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {planName} Plan — <span className="font-bold text-white">{planPrice}/month</span>
            </p>
          </div>

          {step === "pay" ? (
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
                <p className="text-gray-400 text-xs mt-3">
                  Pay exactly <span className="text-white font-bold">{planPrice}</span> to activate your plan
                </p>
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

              {/* Open in UPI App */}
              <div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Smartphone className="w-5 h-5 text-[#E62429]" />
                  <h3 className="font-bold text-white text-sm">Pay with UPI App</h3>
                </div>
                <button
                  onClick={handleOpenUPI}
                  className="w-full flex items-center justify-center gap-2 glass-btn rounded-2xl p-4 hover:bg-white/10 transition-all text-white font-semibold text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open UPI App to Pay
                </button>
                <div className="flex justify-center gap-4 mt-3">
                  {PAYMENT_APPS.map((app) => (
                    <div key={app.name} className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.color} p-[1px]`}>
                        <div className="w-full h-full rounded-lg bg-[#0a0a0a] flex items-center justify-center p-1.5">
                          <img src={app.icon} alt={app.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                      <span className="text-gray-500 text-[10px]">{app.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Step */}
              <button
                onClick={() => setStep("verify")}
                className="w-full bg-gradient-to-r from-[#E62429] to-orange-500 hover:shadow-lg hover:shadow-[#E62429]/30 text-white py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <ArrowUpCircle className="w-4 h-4" />
                I've Made the Payment — Verify Now
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Transaction Verification */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E62429]/15 flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#E62429]" />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">Verify Your Payment</h3>
                <p className="text-gray-400 text-sm">
                  Enter your UPI Transaction ID / UTR number to confirm payment
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  UPI Transaction ID / UTR Number
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => { setTransactionId(e.target.value); setError(""); }}
                  placeholder="e.g. 426113XXXXXX or UTR number from your app"
                  className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#E62429]/50"
                />
                <p className="text-gray-500 text-xs mt-2">
                  You can find this in your UPI app → Transaction History → Payment to {UPI_ID}
                </p>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("pay")}
                  className="flex-1 glass-btn text-white py-3.5 rounded-2xl font-bold text-sm transition-all hover:bg-white/10"
                >
                  Back
                </button>
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/30 text-white py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-50"
                >
                  {verifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify & Activate"
                  )}
                </button>
              </div>

              <p className="text-gray-500 text-[11px] text-center leading-relaxed">
                Your subscription will be activated after verification. If you face any issues, contact us at akplay@akproductionhouse.in
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
