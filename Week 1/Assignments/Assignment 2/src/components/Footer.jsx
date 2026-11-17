function Footer({ year, author }) {
  return (
    <footer className="footer">
      <p>
        Copyright © {year} | Created by {author}
      </p>
    </footer>
  );
}

export default Footer;