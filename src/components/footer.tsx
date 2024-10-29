import Link from "next/link";

export default function Footer() {
  const navigation = {
    main: [
      { name: "Home", href: "/" },
      { name: "Profile", href: "/profile" },
      { name: "Settings", href: "/settings" },
      { name: "Accessibility", href: "/accessibility" },
      { name: "Privacy", href: "/privacy" },
    ],
  };

  return (
    <footer className="bg-base-200 py-6">
      <div className="mx-auto overflow-hidden">
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-8 text-sm"
        >
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-accent hover:text-base-content hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <p className="mt-10 text-center text-accent">
          UCollab — IT SR Capstone project
        </p>
      </div>
    </footer>
  );
}
