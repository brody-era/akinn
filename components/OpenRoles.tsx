"use client";

type Role = {
  title: string;
  href?: string;
  locationNote?: string;
};

type Section = {
  name: string;
  roles: Role[];
};

const sections: Section[] = [
  {
    name: "Growth",
    roles: [
      { title: "Director, Business Development", locationNote: "Hybrid Available" },
      { title: "Protocol Growth Lead",           locationNote: "Hybrid Available" },
      { title: "Institutional DeFi Associate",   locationNote: "Hybrid Available" },
    ],
  },
  {
    name: "Marketing",
    roles: [
      { title: "Senior Graphic Designer, Marketing", locationNote: "Hybrid Available" },
      { title: "Manager, Marketing Ops & Activations", locationNote: "Hybrid Available" },
      { title: "Senior Growth Marketing Manager", locationNote: "Hybrid Available" },
      { title: "Social Media Manager",            locationNote: "Hybrid Available" },
    ],
  },
  {
    name: "Engineering",
    roles: [
      { title: "Staff Move Engineer",           locationNote: "Remote Available" },
      { title: "Staff Smart Contract Engineer", locationNote: "Remote Available" },
    ],
  },
  {
    name: "All",
    roles: [
      { title: "Dream Job", locationNote: "Remote Available", href: "mailto:hey@akinn.xyz" },
    ],
  },
];

export default function OpenRoles() {
  return (
    <div className="mt-8">
      {sections.map((sec) => (
        <section key={sec.name} className="mb-8">
          <h3 className="text-sm font-light text-neutral-500 mb-3">{sec.name}</h3>

          <ol className="divide-y divide-neutral-800 border-t border-neutral-800">
            {sec.roles.map((role, idx) => (
              <li key={`${role.title}-${idx}`} className="relative">
                <a
                  href={role.href ?? "#"}
                  className="flex items-center justify-between gap-6 py-3.5 text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-600"
                >
                  {/* Title */}
                  <span className="text-[0.98rem] text-neutral-200 group-hover:text-white transition-colors">
                    {role.title}
                  </span>

                  {/* Location note with hover glow */}
                  <span className="flex items-center gap-2 text-sm text-neutral-400 transition-all duration-200 group-hover:text-white group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">
                    {role.locationNote}
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      aria-hidden
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    >
                      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
