export const metadata = {
  title: 'UCollab — Accessibility',
};

export default function AccessibilityPage() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      <div className="card bg-base-300 mt-10 p-8 shadow-2xl">
        <h1 className="text-center text-2xl font-bold select-none">Accessibility</h1>
        <h2 className="text-lg font-semibold">Introduction</h2>
        <p>
          UCollab is committed to ensuring digital accessibility for all people. version of the Web Content
          Accessibility Guidelines.
        </p>
        <h2 className="text-lg font-semibold">Our Accessibility Features</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Radix Certified Contrast:</strong> Our color palette is specifically chosen to be as contrasting as
            possible. We have ensured that our different color modes invert the colors seamlessly to provide a
            comfortable viewing experience.
          </li>
          <li>
            <strong>Mobile Accessibility:</strong> The UCollab website is compatibile with mobile devices, allowing
            those with limited computer access to be able to collaborate and contribute with ease.
          </li>
          <li>
            <strong>Text-to-Speech:</strong> Using Web Accessibility Initiative – Accessible Rich Internet Application
            attributes, we are able to provide users the ability to use the text-to-speech function. This allows a
            person to have text read out to them as they are visiting our site.
          </li>
        </ul>
        <h2 className="text-lg font-semibold">Contact Us.</h2>
        <p>
          At UCollab, we want every user to have a smooth experience when visiting our website. If you or anyone you
          know has any issues or any recommendations, please contact us.
        </p>
      </div>
    </div>
  );
}
