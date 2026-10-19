/**
 * Default Legal & Policy Documentation Content Schema
 * Used for Legal & Policies CMS in Admin Dashboard and storefront /legal route.
 * Supports:
 * - Terms & Conditions
 * - Privacy Policy
 * - Shipping Policy
 * - Return & Refund Policy
 * - Compliance & Grievance Meta
 */

export const DEFAULT_LEGAL_CONTENT = {
  lastUpdated: 'October 10, 2026',
  effectiveNotice: 'Effective Immediately for all users across India',
  badgeText: 'Official Legal Documentation',
  supportEmail: 'info@gift.com',
  supportPhone: '+91 0000 000 000',
  supportHours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
  grievanceOfficer: 'Customer Redressal Team',
  companyAddress: 'Hampankatta / Kadri Hills, Mangalore, Karnataka - 575001, India',

  terms: {
    tabTitle: 'Terms & Conditions',
    heroTitle: 'Terms & Conditions of Service',
    heroSubtitle: 'Please read these Terms & Conditions carefully before using our platform, placing customized orders, or requesting personalization services at Fine Gift Studio.',
    sections: [
      {
        id: 'terms-1',
        title: 'Acceptance of Terms & Eligibility',
        content: `Welcome to Fine Gift Studio ("we," "our," "us"). By browsing our website, creating a customer account, utilizing our personalized printing studio, or purchasing products, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.

To place an order or create an account, you must be at least 18 years old or possess legal parental/guardian consent under the laws of the Republic of India. If you are placing orders on behalf of a business entity or corporate client, you warrant that you are authorized to bind that organization.`
      },
      {
        id: 'terms-2',
        title: 'Custom Personalization & Uploaded Media Policy',
        content: `Fine Gift Studio specializes in tailored, made-to-order personalized gifts including ceramic mugs, laser-engraved wooden frames, acrylic awards, custom apparel, and hampers.

Customer Quality Responsibility:
Customers are responsible for the quality, spelling, text layout, and resolution of uploaded photographs. While our design lab optimizes files prior to printing, we cannot be held liable for blurry or pixelated results stemming from low-resolution source images provided by the customer.

Content Restrictions:
You agree not to submit or upload any media, text, or artwork that:
• Infringes upon any third-party copyright, patent, trademark, or proprietary trade secrets.
• Is defamatory, obscene, pornographic, harassing, hate-speech oriented, or unlawful under the Indian Information Technology Act, 2000.
• Promotes illegal activities, violence, or harm against any individual or group.

We reserve the right to decline or cancel any custom printing order containing content that violates our ethical standards.`
      },
      {
        id: 'terms-3',
        title: 'Orders, Pricing & Payment Terms',
        content: `All prices displayed on Fine Gift Studio are listed in Indian Rupees (INR) and include applicable Goods and Services Tax (GST) unless explicitly noted during bulk corporate quotation.

We support major digital payment gateways including Unified Payments Interface (UPI - GPay, PhonePe, Paytm), Net Banking across Indian banks, Visa, MasterCard, RuPay debit/credit cards, and Studio Wallet vouchers. Payment must be received and verified before custom production begins.`
      },
      {
        id: 'terms-4',
        title: 'Order Cancellation & Production Window',
        content: `Because personalized items cannot be restocked or resold once manufactured:
• Cancellation Grace Period: You may request cancellation within 2 hours of placing the order by reaching our hotline or support desk at info@gift.com.
• Post-Production: Once an order transitions to "In Production" (UV printing, laser engraving, or framing has begun), the order is non-cancellable and non-refundable.`
      },
      {
        id: 'terms-5',
        title: 'Intellectual Property Rights',
        content: `All brand logos, graphics, typography, photography, user interface designs, and code across Fine Gift Studio are the proprietary intellectual property of Fine Gift Studio. Reproduction or unauthorized scraping of our catalog designs without written consent is strictly prohibited.

You retain ownership of any personal photographs and private memories you submit for printing. By uploading them, you grant us a limited license strictly to print, package, and fulfill your order.`
      },
      {
        id: 'terms-6',
        title: 'Limitation of Liability',
        content: `In no event shall Fine Gift Studio, its directors, employees, or artisans be liable for any indirect, incidental, consequential, or punitive damages arising out of delays by third-party courier services, unforeseen natural calamities, or incorrect customer delivery details. Our maximum aggregate liability shall not exceed the total amount paid by you for the specific order in dispute.`
      },
      {
        id: 'terms-7',
        title: 'Governing Law & Jurisdiction',
        content: `These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of India. Any legal disputes or claims arising hereunder shall be subject to the exclusive jurisdiction of the competent courts situated in Mangalore, Karnataka, India.`
      }
    ]
  },

  privacy: {
    tabTitle: 'Privacy Policy',
    heroTitle: 'Customer Privacy & Data Protection Policy',
    heroSubtitle: 'Your trust and memory privacy are sacred to us. Learn how Fine Gift Studio protects your uploaded photos, contact information, and payment transactions.',
    guaranteeTitle: '100% Confidential Memory Guarantee',
    guaranteeDesc: 'Your personal photos, couple portraits, family memories, and engraved messages are used solely to craft your physical merchandise. They are never shared, published, or sold to third parties.',
    sections: [
      {
        id: 'priv-1',
        title: 'Information We Collect',
        content: `To fulfill your gifting requirements and deliver memorable experiences, we collect the following categories of information:
• Contact & Account Details: Full Name, Email Address, Mobile Number, Account Password (securely hashed).
• Delivery Destinations: Recipient Name, Delivery Address, Landmark, City, Pincode, and contact numbers.
• Personalization Media: Uploaded images, custom texts, names, dates, and message notes intended for printing or engraving.
• Transaction Records: Order IDs, amounts paid, payment confirmation hashes, and coupon redemptions. (We never store debit/credit card CVVs or net banking passwords).
• Technical Device Data: IP address, device type, browser metadata, and cookie tokens for cart persistence.`
      },
      {
        id: 'priv-2',
        title: 'Uploaded Media & Photo Protection',
        content: `We recognize that personal photographs sent for custom mugs, acrylic frames, or photo albums are deeply intimate. We enforce strict data handling safeguards:
• Uploaded media files are stored in encrypted, access-restricted cloud vaults.
• Only certified production technicians access image files to calibrate print machinery.
• Temporary production image caches are purged periodically after order delivery confirmation.`
      },
      {
        id: 'priv-3',
        title: 'How We Use Your Information',
        content: `We process your data strictly for legitimate operational purposes:
• Manufacturing, quality-inspecting, and packaging your custom gifts.
• Coordinating with express shipping partners for real-time delivery and SMS/WhatsApp AWB tracking updates.
• Issuing official tax invoices and facilitating customer support inquiries.
• Sending celebratory birthday/anniversary gift vouchers (you can opt out with one click anytime).`
      },
      {
        id: 'priv-4',
        title: 'Third-Party Service Providers',
        content: `We share only necessary subsets of data with trusted service providers:
• Logistics Partners: BlueDart, Delhivery, DTDC, and India Post receive delivery address, recipient name, and phone number for shipment dispatch.
• Payment Gateways: PCI-DSS compliant Indian payment aggregators (e.g. Razorpay, UPI) to securely process prepaid orders.
• Communication APIs: Transactional SMS and email notification relays for order receipts.`
      },
      {
        id: 'priv-5',
        title: 'Data Security & Encryption Standards',
        content: `Our website is fortified with 256-bit SSL (Secure Socket Layer) encryption. All data transferred between your browser and our servers is encrypted in transit and at rest. Security audits and firewall reviews are conducted routinely to prevent unauthorized access.`
      },
      {
        id: 'priv-6',
        title: 'Your Privacy Rights & Choices',
        content: `Under Indian privacy laws and international best practices, you have the right to:
• Access and inspect your personal profile details directly through the User Dashboard.
• Update, modify, or correct your stored delivery addresses and phone numbers.
• Request total erasure of your customer account and uploaded assets by emailing our compliance team.
• Unsubscribe from promotional emails or gifting reminders at any time.`
      },
      {
        id: 'priv-7',
        title: 'Grievance Officer & Contact Information',
        content: `In accordance with the Information Technology Act, 2000 and the Rules made thereunder, the contact details of our designated Grievance Officer are provided below:
Grievance Officer: Customer Redressal Team
Fine Gift Studio
Address: Hampankatta / Kadri Hills, Mangalore, Karnataka - 575001, India
Email: info@gift.com
Direct Telephone: +91 0000 000 000 (Mon - Sat: 9:00 AM - 7:00 PM IST)`
      }
    ]
  },

  shipping: {
    tabTitle: 'Shipping Policy',
    heroTitle: 'Shipping & Delivery Policy',
    heroSubtitle: 'Transparent timeline, courier partners, pan-India delivery details, and express dispatch guidelines for all custom printed gifts.',
    sections: [
      {
        id: 'ship-1',
        title: 'Handcrafted Production Timelines',
        content: `Unlike mass-manufactured goods, each item at Fine Gift Studio is individually printed, engraved, and packaged. Production turnaround is typically 1 to 2 business days following payment verification and design confirmation.`
      },
      {
        id: 'ship-2',
        title: 'Pan-India Delivery Partners',
        content: `We partner with India's premier courier networks (BlueDart, Delhivery, DTDC, Express Cargo) to ensure your fragile gifts arrive securely. Standard transit timelines:
• Karnataka & South India Metros: 2 to 3 business days post-dispatch.
• Rest of India (Metro Cities): 3 to 5 business days post-dispatch.
• Remote & Northeast Regions: 5 to 7 business days.`
      },
      {
        id: 'ship-3',
        title: 'Shipping Charges & Free Tier',
        content: `We offer standard delivery starting at a nominal flat fee of ₹49 for small gifts. Orders exceeding ₹999 qualify for 100% Free Express Shipping automatically at checkout.`
      },
      {
        id: 'ship-4',
        title: 'Live AWB Tracking',
        content: `Once dispatched, you will receive an automated tracking notification via SMS/Email containing your Airway Bill (AWB) number. You can also monitor real-time tracking updates directly in your User Dashboard.`
      },
      {
        id: 'ship-5',
        title: 'Delivery Delays & Remote Zones',
        content: `While we make every effort to deliver on schedule, unexpected courier transit delays due to extreme weather, festivals, or local restrictions in remote pin codes may occasionally arise. Our concierge team proactively tracks every parcel until safe doorstep delivery.`
      }
    ]
  },

  returns: {
    tabTitle: 'Return & Refund Policy',
    heroTitle: 'Cancellation, Return & Refund Policy',
    heroSubtitle: 'Our fair and customer-first guidelines regarding order modifications, defective item replacements, and refunds on personalized merchandise.',
    sections: [
      {
        id: 'ret-1',
        title: 'Personalized Merchandise Guidelines',
        content: `Customized gifts carrying individual names, personal photographs, or dates cannot be restocked or resold. As such, standard "change of mind" returns are not permitted once goods have been delivered.`
      },
      {
        id: 'ret-2',
        title: 'Damage in Transit & Print Defects',
        content: `We stand firmly behind our artisanal quality. If your parcel arrives broken, cracked, defective, or displays a printing error made by our lab (such as a spelling mistake differing from your submitted order), we will issue an immediate 100% free replacement.`
      },
      {
        id: 'ret-3',
        title: 'How to Report a Claim (48-Hour Window)',
        content: `To qualify for a prompt replacement or refund:
1. Notify our support team within 48 hours of package delivery.
2. Share clear photos or a brief unboxing video illustrating the transit damage or defect to info@gift.com or WhatsApp (+91 0000 000 000).
3. Our team will inspect the claim and dispatch a brand-new replacement within 24 hours.`
      },
      {
        id: 'ret-4',
        title: 'Refund Processing Timelines',
        content: `Where a replacement is not feasible or in case of duplicate charges, approved refunds are credited back to your original payment source (Bank Account, UPI, or Credit Card) within 5 to 7 business days.`
      }
    ]
  }
};
