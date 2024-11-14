import React from 'react';

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ value, onChange }) => (
  <select
    title="Country Code"
    className="w-24 px-3 py-2 border rounded-md bg-white"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    <option value="+91">IN +91</option>
    <option value="+1">US +1</option>
    <option value="+44">UK +44</option>
  </select>
);