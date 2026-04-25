'use client';

export default function TermsPage() {
  return (
    <div className="w-full bg-gray-50 px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms of Service & Rules</h1>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">1. Platform Overview</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            CVision is an AI-powered recruitment platform that connects job seekers (candidates) with employers (companies). We provide tools and services to facilitate job discovery, applications, testing, and communication between parties.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">2. User Responsibility & Accuracy</h2>
          <p className="text-gray-700 mb-4">
            All users must provide accurate and truthful information when registering and completing their profiles. This includes personal information, qualifications, work experience, education, and any certificates or documents uploaded to the platform. False or misleading information may result in account suspension or permanent deletion.
          </p>
          <p className="text-gray-700">
            Users are responsible for keeping their login credentials confidential and are liable for all activities under their account.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">3. No Liability for Disputes</h2>
          <p className="text-gray-700 mb-4">
            CVision acts as a neutral platform to facilitate introductions between candidates and companies. <strong>We are NOT responsible</strong> for:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Any disputes, disagreements, or conflicts between candidates and companies</li>
            <li>Employment disputes, contract breaches, or wage/benefit issues</li>
            <li>Any harassment, discrimination, or misconduct by users</li>
            <li>Loss, damage, or theft of personal information (except where we have failed in our security obligations)</li>
            <li>Job offers that do not materialize or jobs that are cancelled after acceptance</li>
          </ul>
          <p className="text-gray-700 mt-4">
            All disputes must be resolved directly between the parties involved, or through legal channels. CVision provides a dispute reporting mechanism, but arbitration is limited to platform policy violations only.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">4. Employment Status & Job Application Restrictions</h2>
          <p className="text-gray-700 mb-4">
            Once a candidate accepts and confirms a job offer, they are marked as employed and <strong>cannot apply to new positions</strong>. This restriction ensures ethical job market practices and prevents conflicting employment commitments.
          </p>
          <p className="text-gray-700 mb-4">
            To regain active job-seeking status, employed candidates must:
          </p>
          <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4 mb-4">
            <li>Submit an employment separation request through their dashboard</li>
            <li>Upload proof documentation (separation certificate, resignation letter, etc.)</li>
            <li>Await CVision administrator review and approval</li>
            <li>Upon approval, automatically regain job-seeking status</li>
          </ol>
          <p className="text-gray-700">
            CVision reserves the right to reject separation requests if documentation appears fraudulent or false. Candidates found to have submitted false separation claims may have their accounts suspended.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">5. Advertising & Promotional Content</h2>
          <p className="text-gray-700 mb-4">
            Companies may submit advertising requests to display promotional content in the platform carousel. All advertising content is subject to CVision approval and must comply with all applicable laws and regulations.
          </p>
          <p className="text-gray-700 mb-4">
            CVision reserves the right to reject, approve, or remove any advertising without providing detailed reasons. Approved ads will be displayed on the platform homepage for all visitors.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">6. Company Verification</h2>
          <p className="text-gray-700 mb-4">
            While CVision verifies company documents during registration, <strong>we do not guarantee</strong> that all companies on the platform are legitimate or will fulfill their obligations. We recommend candidates:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Research companies independently before applying</li>
            <li>Be cautious of job offers with unrealistic pay or benefits</li>
            <li>Never pay money upfront or provide bank information to potential employers</li>
            <li>Report suspicious activity to cvision.platform@gmail.com</li>
          </ul>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">7. Account Suspension & Termination</h2>
          <p className="text-gray-700 mb-4">
            CVision reserves the right to suspend or permanently delete any account that:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Violates these terms of service</li>
            <li>Contains false or misleading information</li>
            <li>Engages in harassment, abuse, or discrimination</li>
            <li>Attempts to hack, manipulate, or abuse the platform</li>
            <li>Posts inappropriate, offensive, or illegal content</li>
            <li>Engages in fraudulent activity or scams</li>
          </ul>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
          <p className="text-gray-700 mb-4">
            All content on CVision (including the platform design, features, text, and graphics) is owned by CVision or licensed partners. Users may not reproduce, copy, or redistribute platform content without permission.
          </p>
          <p className="text-gray-700">
            By uploading content (profile, documents, messages) to CVision, you grant us the right to store, process, and display that content as necessary to operate the platform.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">9. Data Privacy</h2>
          <p className="text-gray-700 mb-4">
            Your personal data is processed according to our Privacy Policy. We store data securely but cannot guarantee 100% security. Users are advised not to share sensitive information (passwords, bank details, national IDs) with other users on the platform.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">10. Communication & Notifications</h2>
          <p className="text-gray-700 mb-4">
            CVision communicates with users via email. It is the user's responsibility to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Provide an accurate and active email address</li>
            <li>Check emails regularly for important notifications</li>
            <li>Configure notification preferences in their account settings</li>
            <li>Keep their contact information up to date</li>
          </ul>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">11. Limitation of Liability</h2>
          <p className="text-gray-700 mb-4">
            <strong>To the maximum extent permitted by law</strong>, CVision is provided "as-is" without warranties of any kind. CVision is not liable for:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Indirect, incidental, special, or consequential damages</li>
            <li>Lost profits, lost data, or lost opportunities</li>
            <li>Any interruption or unavailability of the platform</li>
            <li>Errors, bugs, or technical issues</li>
          </ul>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">12. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            CVision uses third-party services (email providers, payment processors, cloud storage, APIs). We are not responsible for any issues with these services or data breaches at third-party providers.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            CVision may update these terms at any time. Continued use of the platform constitutes acceptance of the new terms. We recommend reviewing this page periodically.
          </p>
        </section>

        <section className="mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">14. Contact & Support</h2>
          <p className="text-gray-700 mb-4">
            For questions about these terms or to report violations, please contact:
          </p>
          <p className="text-gray-700 font-semibold">
            Email: cvision.platform@gmail.com<br />
            Website: www.cvision.dz
          </p>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-12">
          <p className="text-sm text-gray-700">
            <strong>Last Updated:</strong> March 2026<br />
            <strong>Jurisdiction:</strong> These terms are governed by the laws applicable in Algeria.
          </p>
        </div>
      </div>
    </div>
  );
}
