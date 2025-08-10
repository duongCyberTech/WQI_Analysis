import {
  Box,
  TextField,
  Typography,
  Select,
  MenuItem
} from '@mui/material';

export const ParameterInput = ({ label, value, onChange, placeholder, unit }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Typography fontSize={18}>{label}</Typography>
    <TextField
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size="small"
    />
    {unit && <Typography fontSize={16}>({unit})</Typography>}
  </Box>
);

export const SelectInput = ({ label, value, onChange }) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Typography fontSize={18}>{label}</Typography>
    <Select
      value={value}
      onChange={onChange}
      size="small"
      sx={{ minWidth: 120 }}
    >
      <MenuItem value="Positive">Positive</MenuItem>
      <MenuItem value="Negative">Negative</MenuItem>
    </Select>
  </Box>
);

