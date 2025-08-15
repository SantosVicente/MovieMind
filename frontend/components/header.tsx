export const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-accent">
      <h1 className="text-2xl font-bold">MovieMind</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a
              href="#"
              className="text-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-lg text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
