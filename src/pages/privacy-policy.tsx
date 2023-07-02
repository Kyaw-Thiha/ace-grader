import TopNavLayout from "@/components/TopNavLayout";
import type { NextPage } from "next";

const PrivacyPolicy: NextPage = () => {
  return (
    <TopNavLayout>
      <div className="mb-40">
        <h1 className="mb-2 text-3xl font-semibold">Privacy Policy</h1>
        <h2 className="mb-4 text-muted-foreground">
          Effective date: 1st July 2023
        </h2>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          1. Information We Collect
        </h2>
        <h3 className="mt-4 text-lg font-medium">1.1 Personal Information:</h3>
        <p>
          We may collect personal information, such as your name, email address,
          and any other information you provide to us when you register for an
          account, create worksheets, or communicate with us. We only collect
          personal information that is necessary to provide you with the
          Service.
        </p>
        <h3 className="mt-4 text-lg font-medium">1.2 Usage Data:</h3>
        <p>
          We may collect information about how you access and use the Service,
          including your IP address, device information, browser type, and
          operating system. This information helps us analyze trends, administer
          the Service, and improve your experience.
        </p>
        <h3 className="mt-4 text-lg font-medium">
          1.3 Cookies and Similar Technologies:
        </h3>
        <p>
          We may use cookies, web beacons, and similar technologies to collect
          information about your browsing activities on our website. Cookies are
          small text files that are stored on your device and help us enhance
          your user experience, analyze usage patterns, and personalize the
          Service.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          2. Use of Information
        </h2>
        <h3 className="mt-4 text-lg font-medium">
          2.1 Providing and Improving the Service:
        </h3>
        <p>
          We use the information we collect to provide you with the Service,
          including creating and sharing worksheets, facilitating communication
          between teachers and students, and grading student submissions. We
          also use the information to improve and enhance the functionality of
          the Service and develop new features.
        </p>
        <h3 className="mt-4 text-lg font-medium">2.2 Communication:</h3>
        <p>
          We may use your personal information to send you administrative
          communications, updates, and important notices related to the Service.
          We may also send you promotional emails about new features, products,
          or other information that may be of interest to you. You can opt-out
          of receiving promotional emails at any time by following the
          unsubscribe instructions provided in the email.
        </p>
        <h3 className="mt-4 text-lg font-medium">2.3 Aggregated Data:</h3>
        <p>
          We may aggregate and anonymize the information we collect to generate
          statistical or demographic information. This aggregated data does not
          personally identify you and may be used for various purposes,
          including research, analytics, and marketing.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">
          3. Sharing of Information
        </h2>
        <h3 className="mt-4 text-lg font-medium">3.1 Service Providers:</h3>
        <p>
          We may engage trusted third-party service providers to perform certain
          functions on our behalf, such as hosting the Service, analyzing data,
          and providing customer support. These service providers have access to
          your personal information only to the extent necessary to perform
          their functions and are contractually obligated to maintain the
          confidentiality and security of your information.
        </p>
        <h3 className="mt-4 text-lg font-medium">3.2 Compliance with Laws:</h3>
        <p>
          We may disclose your personal information if required to do so by law
          or in response to valid legal requests or government investigations.
        </p>
        <h3 className="mt-4 text-lg font-medium">3.3 Business Transfers:</h3>
        <p>
          In the event of a merger, acquisition, or sale of all or a portion of
          our assets, your personal information may be transferred as part of
          the transaction. We will notify you via email or prominent notice on
          our website of any such change in ownership or control of your
          personal information.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">4. Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access, use, or disclosure. However, please be aware that
          no method of transmission over the internet or electronic storage is
          100% secure. While we strive to use commercially acceptable means to
          protect your personal information, we cannot guarantee its absolute
          security.
        </p>
        <h2 className="mb-2 mt-4 text-xl font-semibold">5. Your Choices</h2>
        <h3 className="mt-4 text-lg font-medium">5.1 Account Information:</h3>
        <p>
          You can update or correct your account information by logging into
          your account settings on the Service. If you have any questions or
          concerns about this Privacy Policy or our practices, please contact us
          using the information provided below.
        </p>
      </div>

      {/* <p>
        For more information about our privacy practices, please review our full{" "}
        <a href="[link to your full privacy policy]">Privacy Policy</a>.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy,
        please contact us at [email address].
      </p> */}
    </TopNavLayout>
  );
};

export default PrivacyPolicy;
