import React from 'react';
import Link from 'next/link';
import { COLORS, FONT_FAMILY } from '../../utils/color';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  as = 'button',
  href,
  style,
  ...props
}) => {
  const isOutline = style && style.background === '#fff' && style.border;
  const [hover, setHover] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    background: COLORS.primary,
    color: '#fff',
    borderRadius: '8px',
    padding: '0.75rem 2rem',
    fontWeight: 600,
    fontSize: '1rem',
    boxShadow: '0 2px 8px rgba(67,24,209,0.08)',
    textDecoration: 'none',
    transition: 'background 0.2s, color 0.2s',
    fontFamily: FONT_FAMILY.poppins,
    border: 'none',
    cursor: 'pointer',
    ...style,
  };

  let hoverStyle: React.CSSProperties = {};
  if (isOutline) {
    hoverStyle = hover
      ? { background: COLORS.primary, color: '#fff', border: style.border }
      : { background: '#fff', color: COLORS.primary, border: style.border };
  } else {
    hoverStyle = hover ? { background: '#3413a6' } : {};
  }

  if (as === 'a' && href) {
    return (
      <Link
        href={href}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        style={{ ...baseStyle, ...hoverStyle }}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      style={{ ...baseStyle, ...hoverStyle }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
