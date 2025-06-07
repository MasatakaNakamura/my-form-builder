import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';

function FormRenderer({ formDefinition }) {
  if (!formDefinition || formDefinition.length === 0) {
    return <Box sx={{ color: 'grey.600' }}>プレビューするフォームがありません。</Box>;
  }

  return (
    <Box component="form" noValidate autoComplete="off">
      {formDefinition.map((comp) => {
        const { id, type, properties } = comp;

        switch (type) {
          case 'TEXT_INPUT':
            return (
              <TextField
                key={id}
                label={properties.label}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            );
          case 'TEXT_AREA':
            return (
                <TextField
                  key={id}
                  label={properties.label}
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                />
              );
          case 'CHECKBOX':
            return (
              <FormControlLabel
                key={id}
                control={<Checkbox />}
                label={properties.label}
                sx={{ display: 'block', mt: 1 }}
              />
            );
          case 'RADIO_GROUP':
            return (
              <FormControl key={id} component="fieldset" margin="normal" fullWidth>
                <FormLabel component="legend">{properties.label}</FormLabel>
                <RadioGroup>
                  {properties.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );
          default:
            return null;
        }
      })}
    </Box>
  );
}

export default FormRenderer;