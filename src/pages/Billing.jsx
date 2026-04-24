import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CreditCard, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function Billing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { loadUserData(); }, []);

  const loadUserData = async () => {
    try { const currentUser = await base44.auth.me(); setUser(currentUser); }
    catch (error) { console.error("Error loading user data:", error); }
    finally { setLoading(false); }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    setCancelling(true);
    try {
      const response = await base44.functions.invoke('whopCancelSubscription');
      if (response.data.success) { alert("Your subscription will be cancelled at the end of the current billing period."); await loadUserData(); }
      else throw new Error(response.data.error || "Failed to cancel subscription");
    } catch (error) { console.error("Error cancelling subscription:", error); alert(`Error: ${error.message}`); }
    finally { setCancelling(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="retro-box-dark px-6 py-3 animate-pulse">LOADING...</div></div>;

  const subscription = user?.subscription || { planType: "free", status: "active" };
  const isFree = subscription.planType === "free";

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">BILLING & SUBSCRIPTION</h1>
        <div className="retro-box p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="text-2xl font-bold mb-2">CURRENT PLAN</h2><p className="text-3xl font-bold text-[#2D5F4F]">{subscription.planType.toUpperCase()}</p></div>
            <div className="text-right">
              {subscription.status === "active" && <CheckCircle2 className="w-12 h-12 text-[#2D5F4F] inline" />}
              {subscription.status === "cancelled" && <XCircle className="w-12 h-12 text-red-600 inline" />}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="retro-box p-4"><div className="text-sm opacity-60 mb-1">STATUS</div><div className="text-xl font-bold">{subscription.status?.toUpperCase() || "ACTIVE"}</div></div>
            {subscription.billingCycle && <div className="retro-box p-4"><div className="text-sm opacity-60 mb-1">BILLING CYCLE</div><div className="text-xl font-bold">{subscription.billingCycle?.toUpperCase()}</div></div>}
            {subscription.expiresAt && <div className="retro-box p-4"><div className="text-sm opacity-60 mb-1">{subscription.cancelAtPeriodEnd ? "CANCELS ON" : "RENEWS ON"}</div><div className="text-xl font-bold">{new Date(subscription.expiresAt).toLocaleDateString()}</div></div>}
          </div>
          {!isFree && !subscription.cancelAtPeriodEnd && (
            <button onClick={handleCancelSubscription} disabled={cancelling} className="retro-btn text-sm">
              {cancelling ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />CANCELLING...</span> : "CANCEL SUBSCRIPTION"}
            </button>
          )}
        </div>
        {!isFree && (
          <div className="retro-box p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">PAYMENT METHOD</h2>
            <div className="flex items-center gap-4"><CreditCard className="w-8 h-8" /><div><p className="font-bold">Managed by Whop</p><p className="text-sm opacity-60">To update your payment method, please visit your Whop account settings</p></div></div>
          </div>
        )}
      </div>
    </div>
  );
}