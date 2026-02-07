export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="btn btn-ghost legal-back" onClick={onBack}>
          ← Back
        </button>

        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: February 7, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Fitty ("we", "our", "us"). We respect your privacy and are committed 
            to protecting your personal data. This Privacy Policy explains how we collect, use, 
            and safeguard your information when you use our fitness tracking application.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>Account Information</h3>
          <p>When you create an account, we collect:</p>
          <ul>
            <li>Email address</li>
            <li>Display name (optional)</li>
            <li>Authentication data (provided via email/password or Google sign-in)</li>
          </ul>

          <h3>Fitness Data</h3>
          <p>When you use the app, we store:</p>
          <ul>
            <li>Workout plans (exercises, sets, reps, weights)</li>
            <li>Running plans (distance, type, segments)</li>
            <li>Workout and run history logs</li>
            <li>Any notes you add to your workouts or runs</li>
          </ul>

          <h3>Information We Do NOT Collect</h3>
          <ul>
            <li>Location or GPS data</li>
            <li>Health or biometric data from your device</li>
            <li>Contacts or phone data</li>
            <li>Cookies for advertising or tracking purposes</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information solely to:</p>
          <ul>
            <li>Provide and maintain your account</li>
            <li>Store and display your workout and running data</li>
            <li>Sync your data across devices</li>
            <li>Improve the app experience</li>
          </ul>
          <p>
            We do <strong>not</strong> sell, rent, or share your personal data with third parties 
            for marketing or advertising purposes.
          </p>
        </section>

        <section>
          <h2>4. Data Storage & Security</h2>
          <p>
            Your data is stored securely using Google Firebase, which provides 
            industry-standard encryption and security measures. Data is transmitted 
            over encrypted connections (HTTPS/TLS).
          </p>
          <p>
            While we take reasonable measures to protect your data, no method of 
            electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Google Firebase Authentication</strong> — for account creation and sign-in</li>
            <li><strong>Google Cloud Firestore</strong> — for storing your fitness data</li>
          </ul>
          <p>
            These services have their own privacy policies. We encourage you to review 
            Google's Privacy Policy at{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Update or correct your information</li>
            <li>Delete your account and all associated data</li>
            <li>Export your data</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the details below.
          </p>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. If you delete 
            your account, all associated data will be permanently removed from our systems.
          </p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            Our app is not intended for children under the age of 13. We do not 
            knowingly collect personal data from children under 13. If you believe 
            a child has provided us with personal data, please contact us so we can 
            remove it.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be 
            reflected on this page with an updated date. Continued use of the app 
            after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or your data, 
            please reach out to us at the app's support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
