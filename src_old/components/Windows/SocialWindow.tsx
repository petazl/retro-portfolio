import "./SocialWindow.css";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/petazl" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/richmond-kyawzay-9772b8288/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/petazled/?hl=en",
  },
];

function SocialWindow() {
  return (
    <div className="window-content">
      <h1>Social</h1>

      <p>Find me around the internet.</p>

      <hr />

      <div className="social-links">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default SocialWindow;
