import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Try It",
    price: 0,
    priceId: null,
    description: "For testing and evaluation purposes",
    features: [
      "2 transformations per month",
      "Instagram, TikTok, YouTube support",
      "Basic features only",
      "Watermarked output",
      "720p video quality",
      "Email support"
    ],
    limitations: [
      "Limited transformations",
      "Watermarks included",
      "Basic features only",
      "No advanced analytics"
    ],
    buttonText: "Start Free Trial",
    popular: false
  },
  {
    name: "Creator",
    price: 19.99,
    priceId: "price_creator_monthly",
    description: "For individual creators scaling content",
    features: [
      "20 transformations per month",
      "No watermarks",
      "Instagram, TikTok, YouTube support",
      "Basic title algorithm optimization",
      "720p video quality",
      "Connect up to 3 accounts per platform",
      "Basic analytics dashboard",
      "Email support"
    ],
    limitations: [
      "Limited to 720p quality",
      "Basic analytics only",
      "Standard support"
    ],
    buttonText: "Choose Creator",
    popular: true
  },
  {
    name: "Professional",
    price: 39.99,
    priceId: "price_professional_monthly",
    description: "For established creators with regular posting",
    features: [
      "50 transformations per month",
      "No watermarks",
      "All social media platforms",
      "Advanced title algorithm with keywords",
      "1080p HD video quality",
      "Connect up to 5 accounts per platform",
      "Advanced analytics with insights",
      "Priority email support",
      "Bulk transformation queue (up to 5)",
      "Scheduled transformations",
      "Custom branding options"
    ],
    limitations: [
      "Limited to 50 transformations",
      "Up to 5 bulk transformations"
    ],
    buttonText: "Choose Professional",
    popular: false
  },
  {
    name: "Studio",
    price: 89.99,
    priceId: "price_studio_monthly",
    description: "For professional creators and small teams",
    features: [
      "Unlimited transformations",
      "No watermarks",
      "All platforms + priority for new ones",
      "Premium algorithm with trending topics",
      "4K video quality where supported",
      "Connect unlimited accounts",
      "Comprehensive analytics with benchmarking",
      "Dedicated account manager",
      "Unlimited bulk transformations",
      "Advanced scheduling & publishing calendar",
      "Custom templates and branding",
      "API access for integrations",
      "Team collaboration (up to 5 members)"
    ],
    limitations: [],
    buttonText: "Choose Studio",
    popular: false
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const getDisplayPrice = (price: number) => {
    if (billingCycle === "yearly") {
      // Apply specific yearly discounts per your proposal
      if (price === 19.99) return 199.99; // Save $40
      if (price === 39.99) return 399.99; // Save $80
      if (price === 89.99) return 899.99; // Save $180
      return price * 12;
    }
    return price;
  };

  const getMonthlyPrice = (price: number) => {
    if (billingCycle === "yearly") {
      // Calculate effective monthly price with yearly discounts
      if (price === 19.99) return 16.66; // $199.99/12
      if (price === 39.99) return 33.33; // $399.99/12
      if (price === 89.99) return 74.99; // $899.99/12
      return price;
    }
    return price;
  };

  const getYearlySavings = (price: number) => {
    if (price === 19.99) return 40;
    if (price === 39.99) return 80;
    if (price === 89.99) return 180;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <span className="text-2xl font-bold text-[#FF7846]">ContentTransformer</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your content across platforms with our powerful AI tools
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              style={{ border: "none", cursor: "pointer" }}
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              style={{ border: "none", cursor: "pointer" }}
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular 
                  ? "border-[#FF7846] shadow-lg scale-105 bg-gradient-to-b from-white to-orange-50" 
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#FF7846] text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price === 0 ? "0" : getMonthlyPrice(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">
                      /{billingCycle === "yearly" ? "mo" : "month"}
                    </span>
                  )}
                  {billingCycle === "yearly" && plan.price > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      ${getDisplayPrice(plan.price)} billed yearly
                      <div className="text-green-600 font-medium">
                        Save ${getYearlySavings(plan.price)}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  className={`w-full mb-6 ${
                    plan.popular 
                      ? "bg-[#FF7846] hover:bg-[#FF5A2D]" 
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  asChild={plan.name === "Try It"}
                >
                  {plan.name === "Try It" ? (
                    <Link to="/login">{plan.buttonText}</Link>
                  ) : (
                    <span>{plan.buttonText}</span>
                  )}
                </Button>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5 mr-3" />
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens to watermarks with paid plans?
              </h3>
              <p className="text-gray-600 text-sm">
                All paid plans remove watermarks from your transformed content automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do transformation limits reset monthly?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, all transformation limits reset on the first day of each month.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600 text-sm">
                You can cancel anytime from your account settings. You'll keep access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 