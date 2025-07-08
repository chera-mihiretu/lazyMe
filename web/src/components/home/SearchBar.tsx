import React from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/color';

const SearchBar: React.FC = () => (
  <input
    type="text"
    placeholder="Search..."
    style={{
      width: 200,
      padding: '0.6rem 1rem',
      border: `1.5px solid ${COLORS.inputBorder}`,
      borderRadius: 8,
      fontFamily: FONT_FAMILY.poppins,
      fontSize: '1rem',
      outline: 'none',
      background: COLORS.inputBg,
      color: '#171717',
      boxShadow: '0 1px 4px #e0e0e0',
      transition: 'border 0.2s, box-shadow 0.2s',
    }}
    aria-label="Search"
  />
);

export default SearchBar;
