import React from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/color';


interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}


const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...', buttonLabel, onButtonClick }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: 220,
        padding: '0.6rem 1rem',
        border: `1.5px solid #e0e0e0`,
        borderRadius: 8,
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1rem',
        outline: 'none',
        background: '#f7f7fb',
        color: '#171717',
        boxShadow: '0 1px 4px #e0e0e0',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}
      aria-label={placeholder}
    />
    {buttonLabel && (
      <button
        onClick={onButtonClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#4320d1',
          color: '#fff',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          borderRadius: 8,
          padding: '0.6rem 1.5rem',
          border: 'none',
          boxShadow: '0 1px 4px #e0e0e0',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {buttonLabel}
      </button>
    )}
  </div>
);

export default SearchBar;
