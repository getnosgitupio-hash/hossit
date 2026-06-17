import logo from '../../images/download.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img src={logo} alt="Hoisst Logo" />
      </div>

      <p className="footer-tagline">Together we sell, we rise.</p>

      <a href="mailto:hello@hoisst.in" className="footer-email">
        HELLO@HOISST.IN
      </a>
    </footer>
  );
}
