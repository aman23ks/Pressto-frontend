'use client';

import React from 'react';
import { ArrowLeft, ArrowUp, Printer } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center h-16">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold">Terms and Conditions</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose max-w-none">
            {/* Introduction */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
              <p className="text-gray-600 mb-4">Effective Date: December 13, 2024</p>
              
              <p className="text-gray-700">
                Welcome to Pressto! These Terms and Conditions (hereinafter referred to as "Terms") 
                constitute a legally binding agreement governing the rights and responsibilities of all 
                parties accessing and utilizing the platform, including consumers and shop owners, as 
                provided by Pressto (hereinafter referred to as "Platform"). By availing the Platform's 
                Services, you affirm your irrevocable consent to abide by these Terms. Non-compliance 
                with these Terms mandates immediate cessation of all access to the Services.
              </p>
            </div>

            <div className="space-y-8">
              {/* 1. Definitions */}
              <section>
                <h2 className="text-xl font-semibold">1. Definitions and Applicability</h2>
                <p className="mt-4 mb-4">For the purpose of this document:</p>
                <ul className="list-disc pl-6 space-y-3 text-gray-700">
                  <li>
                    <strong>"Consumer"</strong> refers to an individual seeking to engage laundry-related 
                    services, such as ironing, washing, and dry-cleaning, as offered by shop owners 
                    through the Platform.
                  </li>
                  <li>
                    <strong>"Shop Owner"</strong> refers to individuals or entities who list their 
                    laundry-related services on the Platform to facilitate transactions with Consumers.
                  </li>
                  <li>
                    <strong>"Services"</strong> refer to the functionalities provided by the Platform, 
                    encompassing but not limited to the listing, searching, booking, and order management 
                    of laundry-related services. The Platform does not process, handle, or facilitate any 
                    payments between Consumers and Shop Owners.
                  </li>
                  <li>
                    <strong>"Platform"</strong> encapsulates the website, mobile application, and 
                    associated technological infrastructure provided by Pressto as an order management system.
                  </li>
                </ul>
                <p className="mt-4 text-gray-700">
                  These Terms shall apply universally to all Consumers and Shop Owners engaging with 
                  the Platform.
                </p>
              </section>

              {/* 2. Eligibility */}
              <section>
                <h2 className="text-xl font-semibold">2. Eligibility Requirements</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="font-semibold mb-2">For Consumers:</p>
                    <p className="text-gray-700">
                      Eligibility for registering an account requires that you are of legal age as 
                      defined in your jurisdiction (18 years or older) and possess the legal capacity 
                      to enter into binding agreements. Consumers agree to provide accurate, complete, 
                      and current account information and to maintain confidentiality of their 
                      credentials. Any breach of account security remains the responsibility of the Consumer.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">For Shop Owners:</p>
                    <p className="text-gray-700">
                      Shop Owners warrant that they are duly authorized and legally capable of listing 
                      and performing the services advertised on the Platform. The Shop Owner further 
                      certifies that all required licenses, permits, and certifications mandated under 
                      local laws are maintained at all times during the usage of the Platform.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Platform Role */}
              <section>
                <h2 className="text-xl font-semibold">3. Scope and Intermediary Role of the Platform</h2>
                <p className="mt-4 text-gray-700">
                  The Platform operates solely as an order management system, facilitating the connection 
                  between Consumers and Shop Owners. The Platform does not process payments or handle 
                  any financial transactions between parties. At no point does the Platform directly 
                  render or assume liability for the quality, timing, or accuracy of services provided 
                  by the Shop Owners, nor for any payment arrangements between Consumers and Shop Owners. 
                  The Platform does not represent either party in contractual or financial relationships 
                  arising from service transactions.
                </p>
              </section>

              {/* 4. Shop Owner Responsibilities */}
              <section>
                <h2 className="text-xl font-semibold">4. Responsibilities of Shop Owners</h2>
                <p className="mt-4 mb-4">
                  Shop Owners availing the Platform agree to fulfill the following obligations:
                </p>
                <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                  <li>
                    <strong>Accurate Listings:</strong> Ensure that all service details, including but 
                    not limited to pricing, operating hours, service coverage areas, and quality 
                    standards, are precise, lawful, and up-to-date.
                  </li>
                  <li>
                    <strong>Service Excellence:</strong> Guarantee punctual, professional, and 
                    high-quality fulfillment of Consumer requests.
                  </li>
                  <li>
                    <strong>Dispute Resolution:</strong> Assume complete responsibility for addressing 
                    and resolving disputes or grievances initiated by Consumers.
                  </li>
                  <li>
                    <strong>Payment Management:</strong> Shop Owners are solely responsible for managing 
                    all payment-related matters with Consumers, including setting prices, collecting 
                    payments, and handling refunds. The Platform does not participate in or facilitate 
                    any financial transactions between parties.
                  </li>
                  <li>
                    <strong>Liability Compliance:</strong> Acknowledge sole accountability for any 
                    damage, loss, or inconvenience caused due to the service rendered, including legal 
                    compliance for all operational activities.
                  </li>
                </ol>
                <p className="mt-4 text-gray-700">
                  Non-compliance may result in account suspension or permanent removal from the Platform 
                  without prior notice.
                </p>
              </section>

              {/* 5. Consumer Responsibilities */}
              <section>
                <h2 className="text-xl font-semibold">5. Responsibilities of Consumers</h2>
                <p className="mt-4 mb-4">Consumers utilizing the Services shall:</p>
                <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                  <li>
                    <strong>Order Accuracy:</strong> Provide accurate and complete details while 
                    placing service requests.
                  </li>
                  <li>
                    <strong>Payment Responsibility:</strong> Handle all payments directly with Shop 
                    Owners. The Platform does not process or manage any financial transactions.
                  </li>
                  <li>
                    <strong>Respectful Conduct:</strong> Treat Shop Owners and Platform representatives 
                    respectfully, refraining from abusive or unlawful behavior.
                  </li>
                  <li>
                    <strong>Inspection Obligation:</strong> Inspect delivered items upon receipt. 
                    Discrepancies, if any, must be reported within 24 hours of receipt.
                  </li>
                  <li>
                    <strong>Direct Dispute Engagement:</strong> Engage in direct communication with 
                    Shop Owners regarding any complaints, payment issues, or service-related matters.
                  </li>
                </ol>
              </section>

              {/* 6. Payment Terms */}
              <section>
                <h2 className="text-xl font-semibold">6. Payment Terms and Direct Transactions</h2>
                <div className="mt-4 space-y-4 text-gray-700">
                  <div>
                    <p className="font-semibold">Payment Processing:</p>
                    <p>The Platform does not process, handle, or facilitate any payments. All financial 
                    transactions occur directly between Consumers and Shop Owners. The Platform serves 
                    solely as an order management system and bears no responsibility for any payment-related 
                    matters.</p>
                  </div>
                  <div>
                    <p className="font-semibold">Payment Arrangements:</p>
                    <p>Consumers and Shop Owners are solely responsible for arranging and managing their 
                    payment terms, methods, and transactions independently of the Platform. Any payment 
                    disputes must be resolved directly between the Consumer and Shop Owner.</p>
                  </div>
                  <div>
                    <p className="font-semibold">Refunds and Disputes:</p>
                    <p>The Platform does not manage, process, or facilitate refunds of any kind. All 
                    refund requests and payment disputes must be handled directly between Consumers 
                    and Shop Owners. The Platform bears no liability for any payment-related issues, 
                    including but not limited to refunds, disputes, or transaction failures.</p>
                  </div>
                  <div>
                    <p className="font-semibold">Record Keeping:</p>
                    <p>While the Platform maintains order records, all payment receipts, transaction 
                    records, and financial documentation must be maintained independently by both 
                    parties for their reference and dispute resolution.</p>
                  </div>
                </div>
              </section>

              {/* 7. Platform Liability */}
              <section>
                <h2 className="text-xl font-semibold">7. Platform Liability and Indemnification</h2>
                <p className="mt-4 mb-4 text-gray-700">
                  The Platform's liability is strictly limited to its role as an order management 
                  facilitator. Under no circumstances shall the Platform be held liable for:
                </p>
                <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                  <li>
                    Any payment-related matters, including but not limited to transaction failures, 
                    payment disputes, refunds, or financial losses of any kind between Consumers 
                    and Shop Owners.
                  </li>
                  <li>
                    Service defects, including but not limited to color bleeding, shrinkage, or 
                    fabric damage.
                  </li>
                  <li>
                    Loss of personal belongings left within garments, such as jewelry or cash.
                  </li>
                  <li>
                    Delays or non-performance arising from force majeure events or other circumstances 
                    beyond reasonable control.
                  </li>
                  <li>
                    Consequential damages, including loss of income, reputation, or personal injury 
                    resulting from use of the Services.
                  </li>
                </ol>
              </section>

              {/* 8. Amendments */}
              <section>
                <h2 className="text-xl font-semibold">8. Amendments to Terms</h2>
                <p className="mt-4 text-gray-700">
                  The Platform reserves the unrestricted right to modify, update, or amend these Terms 
                  at its sole discretion without prior notification. Any amendments will become effective 
                  immediately upon publication on the Platform. Users are encouraged to review the Terms 
                  periodically. Continued use of the Services post-amendment constitutes unqualified 
                  acceptance of the revised Terms.
                </p>
              </section>

              {/* 9. Account Suspension */}
              <section>
                <h2 className="text-xl font-semibold">9. Account Suspension and Termination</h2>
                <p className="mt-4 mb-4 text-gray-700">
                  The Platform reserves the right to suspend or terminate user accounts under 
                  circumstances including but not limited to:
                </p>
                <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                  <li>Breach of these Terms.</li>
                  <li>Engagement in fraudulent, abusive, or unlawful activity.</li>
                  <li>Conduct detrimental to the Platform's integrity or operations.</li>
                </ol>
                <p className="mt-4 text-gray-700">
                  Users may terminate their accounts by submitting written notice, subject to settlement 
                  of all outstanding obligations with other users.
                </p>
              </section>

              {/* 10. Privacy Policy */}
              <section>
                <h2 className="text-xl font-semibold">10. Privacy Policy Compliance</h2>
                <p className="mt-4 text-gray-700">
                  The handling of all user data collected by the Platform adheres strictly to the 
                  provisions outlined in our Privacy Policy. Users affirm consent to these practices 
                  by engaging with the Services.
                </p>
              </section>

              {/* 11. Governing Law */}
              <section>
                <h2 className="text-xl font-semibold">11. Governing Law and Dispute Resolution</h2>
                <p className="mt-4 text-gray-700">
                  These Terms shall be governed by the substantive and procedural laws of Karnataka, 
                  India. Disputes arising hereunder shall be resolved through arbitration in accordance 
                  with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be 
                  Bangalore, Karnataka.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mt-12 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold">12. Contact Information</h2>
                <p className="mt-4 text-gray-700">
                  For inquiries, grievances, or clarifications, users may contact us at:
                </p>
                <div className="mt-4 space-y-2 text-gray-700">
                  <div className="flex items-start">
                    <span className="font-medium w-20">Email:</span>
                    <span>resolvemyqueries@gmail.com</span>
                  </div>
                  {/* <div className="flex items-start">
                    <span className="font-medium w-20">Address:</span>
                    <span>
  123 Business Street<br/>
  Bangalore, Karnataka<br/>
  India - 560001
</span>
                  </div> */}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Buttons */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <button
        onClick={() => window.print()}
        className="fixed bottom-20 right-6 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <Printer className="h-5 w-5" />
      </button>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .prose { font-size: 12pt; }
          button { display: none; }
          .fixed { position: static; }
          .shadow-lg { box-shadow: none; }
          .bg-gray-50 { background-color: white; }
        }
      `}</style>
    </div>
  );
};

export default TermsPage;