export default function TermsAndConditions({ onBack }) {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <button className="btn btn-ghost legal-back" onClick={onBack}>
          ← Back
        </button>

        <h1>Terms & Conditions</h1>
        <p className="legal-updated">Last updated: February 7, 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or using Fitty ("the App"), you agree to be bound 
            by these Terms & Conditions. If you do not agree, please do not use the App.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            Fitty is a personal fitness tracking application that allows you to create 
            workout plans, running plans, log your exercises and runs, and track your 
            progress over time. The App is provided for personal, non-commercial use.
          </p>
        </section>

        <section>
          <h2>3. Account Registration</h2>
          <ul>
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
          </ul>
        </section>

        <section>
          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the App for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to the App or its systems</li>
            <li>Interfere with or disrupt the App's functionality</li>
            <li>Reverse engineer, decompile, or disassemble any part of the App</li>
            <li>Use the App to collect data about other users</li>
            <li>Create multiple accounts for abusive purposes</li>
          </ul>
        </section>

        <section>
          <h2>5. Your Content</h2>
          <p>
            You retain ownership of any data you enter into the App (workout plans, 
            run plans, notes, etc.). By using the App, you grant us permission to store 
            and process this data solely for the purpose of providing the service to you.
          </p>
        </section>

        <section>
          <h2>6. Health Disclaimer</h2>
          <p>
            <strong>The App is not a substitute for professional medical advice, diagnosis, 
            or treatment.</strong> Always consult a qualified healthcare provider or fitness 
            professional before starting any exercise program.
          </p>
          <ul>
            <li>We do not provide medical or fitness advice.</li>
            <li>The App is a tracking tool only — it does not prescribe exercises or routines.</li>
            <li>You exercise at your own risk and are solely responsible for your physical safety.</li>
            <li>Stop exercising immediately if you experience pain, dizziness, or discomfort.</li>
          </ul>
        </section>

        <section>
          <h2>7. Availability & Changes</h2>
          <p>
            We strive to keep the App available at all times, but we do not guarantee 
            uninterrupted access. We reserve the right to:
          </p>
          <ul>
            <li>Modify, update, or discontinue features at any time</li>
            <li>Perform maintenance that may temporarily affect availability</li>
            <li>Change these Terms with notice provided through the App</li>
          </ul>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Fitty and its creators shall not be 
            liable for any indirect, incidental, special, or consequential damages arising 
            from your use of the App, including but not limited to:
          </p>
          <ul>
            <li>Loss of data</li>
            <li>Physical injury resulting from exercises tracked in the App</li>
            <li>Interruption of service</li>
            <li>Any errors or inaccuracies in the App</li>
          </ul>
        </section>

        <section>
          <h2>9. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time if you 
            violate these Terms. You may also delete your account at any time. Upon 
            termination, your data will be permanently removed.
          </p>
        </section>

        <section>
          <h2>10. Intellectual Property</h2>
          <p>
            The App, including its design, code, and branding, is the property of Fitty's 
            creators. You may not copy, modify, or distribute any part of the App without 
            prior written permission.
          </p>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable 
            local laws. Any disputes arising from these Terms or your use of the App shall 
            be resolved through good-faith negotiation first.
          </p>
        </section>

        <section>
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about these Terms & Conditions, please reach out 
            to us at the app's support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
