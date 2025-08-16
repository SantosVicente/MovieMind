import React from "react";

const Footer: React.FC = () => (
  <footer
    style={{
      width: "100%",
      padding: "1rem 0",
      background: "#222",
      color: "#fff",
      textAlign: "center",
      zIndex: 100,
    }}
  >
    <span>
      &copy; {new Date().getFullYear()} MovieMind. Todos os direitos reservados.
    </span>
  </footer>
);

export default Footer;
