export const metadata = {
  title: 'UCollab — Accessibility',
};

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center text-2xl font-bold select-none">Accessibility</h1>

      <div className="bg-background mt-8 w-full max-w-3xl rounded-lg p-8 shadow-2xl">
        <p className="text-secondary mb-4 text-sm">
          <strong>Last Updated:</strong> March 7th, 2025
        </p>

        <h2 className="text-lg font-semibold">Introduction</h2>
        <p>
          UCollab is committed to ensuring digital accessibility for all users. We adhere to the Web Content
          Accessibility Guidelines (WCAG) to create an inclusive experience for all visitors.
        </p>

        <h2 className="mt-6 text-lg font-semibold">Our Accessibility Features</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Radix Certified Contrast:</strong> Our color palette is designed for maximum readability across
            different themes.
          </li>
          <li>
            <strong>Mobile Accessibility:</strong> The UCollab website is optimized for mobile devices, ensuring smooth
            access on all screen sizes.
          </li>
          <li>
            <strong>Text-to-Speech:</strong> We utilize Web Accessibility Initiative (WAI) standards to enable
            text-to-speech functionality.
          </li>
        </ul>

        <h2 className="mt-6 text-lg font-semibold">Commitment to Improvement</h2>
        <p>
          We continuously work to improve accessibility by conducting audits and implementing feedback-driven
          enhancements.
        </p>

        <h2 className="mt-6 text-lg font-semibold">Contact Us</h2>
        <p>
          If you encounter any accessibility issues or have recommendations, please contact us. We are dedicated to
          making UCollab an inclusive and user-friendly platform for everyone.
        </p>
      </div>
    </div>
  );
}
