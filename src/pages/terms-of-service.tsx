import TopNavLayout from "@/components/TopNavLayout";
import type { NextPage } from "next";

const TermsOfService: NextPage = () => {
  return (
    <TopNavLayout>
      <div className="mb-40">
        <h1 className="mb-2 text-3xl font-semibold">Terms of Service</h1>
        <h2 className="mb-4 text-muted-foreground">
          Effective date: 1st July 2023
        </h2>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          1. Acceptance of Terms
        </h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
          AceGrader website software (the &ldquo;Service&rdquo;). By accessing
          or using the Service, you agree to be bound by these Terms. If you do
          not agree to these Terms, you should not use the Service.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          2. Use of the Service
        </h2>
        <h3 className="mt-4 text-lg font-medium">2.1 Eligibility:</h3>
        <p>
          You must be at least 18 years old and have the legal authority to
          enter into these Terms or, if you are under 18 years old, have
          obtained the consent of your parent or legal guardian to use the
          Service.
        </p>
        <h3 className="mt-4 text-lg font-medium">2.2 User Accounts:</h3>
        <p>
          To access certain features of the Service, you may need to create an
          account. You are responsible for maintaining the confidentiality of
          your account credentials and are solely responsible for all activities
          that occur under your account.
        </p>
        <h3 className="mt-4 text-lg font-medium">2.3 Prohibited Conduct:</h3>
        <p>
          You agree not to engage in any conduct that violates these Terms or
          any applicable laws or regulations. This includes, but is not limited
          to, unauthorized access to the Service, interfering with the operation
          of the Service, and transmitting or uploading any harmful or offensive
          content.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          3. Intellectual Property Rights
        </h2>
        <h3 className="mt-4 text-lg font-medium">3.1 Ownership:</h3>
        <p>
          AceGrader and its licensors retain all rights, title, and interest in
          and to the Service, including all intellectual property rights. You
          acknowledge that you do not acquire any ownership rights by using the
          Service.
        </p>
        <h3 className="mt-4 text-lg font-medium">3.2 License:</h3>
        <p>
          Subject to your compliance with these Terms, AceGrader grants you a
          limited, non-exclusive, non-transferable, revocable license to use the
          Service for its intended purpose.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">4. Privacy</h2>
        <h3 className="mt-4 text-lg font-medium">
          4.1 Collection of Information:
        </h3>
        <p>
          By using the Service, you acknowledge and agree that AceGrader may
          collect and use your personal information as described in the
          AceGrader Privacy Policy.
        </p>
        <h3 className="mt-4 text-lg font-medium">4.2 User Data:</h3>
        <p>
          As a user of the Service, you retain ownership of any data or content
          you submit or upload to the Service. However, you grant AceGrader a
          worldwide, non-exclusive, royalty-free license to use, reproduce,
          modify, adapt, publish, distribute, and display such data or content
          for the purpose of providing and improving the Service.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          5. Disclaimer of Warranties
        </h2>
        <p>
          The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; basis. AceGrader makes no representations or
          warranties of any kind, express or implied, regarding the Service or
          its operation. To the fullest extent permitted by law, AceGrader
          disclaims all warranties, whether statutory, express, or implied,
          including but not limited to warranties of merchantability, fitness
          for a particular purpose, and non-infringement.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          6. Limitation of Liability
        </h2>
        <p>
          In no event shall AceGrader be liable to you or any third party for
          any indirect, incidental, special, consequential, or punitive damages,
          including but not limited to lost profits, data loss, or any other
          damages arising out of or in connection with your use of the Service,
          even if AceGrader has been advised of the possibility of such damages.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          7. Governing Law and Dispute Resolution
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of [Jurisdiction]. Any dispute arising out of or relating to
          these Terms or the Service shall be exclusively resolved in the courts
          of [Jurisdiction].
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          8. Modifications to the Terms
        </h2>
        <p>
          AceGrader reserves the right to modify or update these Terms at any
          time. Any changes to the Terms will be effective immediately upon
          posting the updated version on the Service. Your continued use of the
          Service after the posting of any changes constitutes your acceptance
          of such changes.
        </p>
        {/* <h2 className="mb-2 mt-4 text-xl font-semibold">9. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding these Terms, please
          contact us at [email address].
        </p> */}
      </div>
    </TopNavLayout>
  );
};

export default TermsOfService;
