export const metadata = {
  title: "UCollab — Accessibility",
};

export default function AccessibilityPage() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      <h1 className="text-center text-2xl font-bold select-none">Accessibility</h1>

      <div className="mt-8 max-w-3xl w-full bg-base-300 p-8 rounded-lg shadow-2xl">
        <p className="text-accent text-sm mb-4">
          <strong>Last Updated:</strong> March 7th, 2025
        </p>

        <h2 className="text-lg font-semibold">Introduction</h2>
        <p>
          UCollab is committed to ensuring digital accessibility for all users. We adhere to the Web Content Accessibility Guidelines (WCAG) 
          to create an inclusive experience for all visitors.
        </p>

        <h2 className="text-lg font-semibold mt-6">Our Accessibility Features</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Radix Certified Contrast:</strong> Our color palette is designed for maximum readability across different themes.
          </li>
          <li>
            <strong>Mobile Accessibility:</strong> The UCollab website is optimized for mobile devices, ensuring smooth access on all screen sizes.
          </li>
          <li>
            <strong>Text-to-Speech:</strong> We utilize Web Accessibility Initiative (WAI) standards to enable text-to-speech functionality.
          </li>
        </ul>

        <h2 className="text-lg font-semibold mt-6">Commitment to Improvement</h2>
        <p>
          We continuously work to improve accessibility by conducting audits and implementing feedback-driven enhancements.
        </p>

        <h2 className="text-lg font-semibold mt-6">Contact Us</h2>
        <p>
          If you encounter any accessibility issues or have recommendations, please contact us. We are dedicated to making UCollab an 
          inclusive and user-friendly platform for everyone.
        </p>
      </div>
    </div>
  );
}
