import { useState } from "react";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { motion } from "motion/react";

type PlanId = "basic" | "standard" | "premium";

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  icon: typeof Sparkles;
  color: string;
  shadow: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "₹149",
    period: "/month",
    icon: Zap,
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
    features: [
      "720p streaming quality",
      "Watch on 1 device",
      "Limited content library",
      "Ad-supported",
      "Mobile-only access",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: "₹399",
    period: "/month",
    icon: Sparkles,
    color: "from-[#E62429] to-orange-500",
    shadow: "shadow-[#E62429]/25",
    popular: true,
    features: [
      "1080p Full HD streaming",
      "Watch on 3 devices",
      "Full content library",
      "Ad-free experience",
      "Download for offline",
      "Early access to originals",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹699",
    period: "/month",
    icon: Crown,
    color: "from-amber-400 to-yellow-500",
    shadow: "shadow-amber-400/20",
    features: [
      "4K Ultra HD + HDR",
      "Watch on 5 devices",
      "Full content library",
      "Ad-free experience",
      "Download for offline",
      "Early access to originals",
      "Exclusive behind-the-scenes",
      "Priority support",
    ],
  },
];

export function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [subscribed, setSubscribed] = useState<PlanId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = (planId: PlanId) => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setSubscribed(planId);
    }, 2000);
  };

  return (
    <div className="min-h-full bg-[#050505] text-white py-8 md:py-12 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 md:mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
          Unlock unlimited entertainment with AKPLAY. Pick the plan that suits you best.
        </p>
      </motion.div>

      {subscribed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto mb-12 glass-card rounded-3xl p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
          <p className="text-gray-400 text-sm">
            You're now on the{" "}
            <span className="text-white font-semibold">
              {PLANS.find((p) => p.id === subscribed)?.name}
            </span>{" "}
            plan. Enjoy streaming!
          </p>
          <button
            onClick={() => {
              setSubscribed(null);
              setSelectedPlan(null);
            }}
            className="mt-6 text-sm text-gray-500 hover:text-white transition-colors"
          >
            Change Plan
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrent = subscribed === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative glass-card rounded-3xl p-6 md:p-8 flex flex-col ${
                plan.popular ? `ring-1 ring-[#E62429]/30 ${plan.shadow} shadow-2xl` : ""
              } ${isCurrent ? "ring-2 ring-green-500/40" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#E62429] to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} p-[1px] mb-6`}>
                <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isProcessing || isCurrent}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  isCurrent
                    ? "bg-green-500/15 text-green-400 cursor-default"
                    : plan.popular
                    ? `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 hover:shadow-lg ${plan.shadow}`
                    : "glass-btn text-white hover:bg-white/12"
                } disabled:opacity-50`}
              >
                {isCurrent
                  ? "Current Plan"
                  : isProcessing && selectedPlan === plan.id
                  ? "Processing..."
                  : "Subscribe Now"}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-3xl mx-auto mt-20"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. No hidden fees or penalties." },
            { q: "Is there a free trial?", a: "We offer a 7-day free trial on all plans for new subscribers." },
            { q: "Can I switch plans?", a: "Absolutely! You can upgrade or downgrade your plan anytime from your account settings." },
            { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, and net banking." },
          ].map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <h4 className="font-semibold mb-2">{faq.q}</h4>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
