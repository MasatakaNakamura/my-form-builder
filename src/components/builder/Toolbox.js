import React from 'react';
import { Box, Typography } from '@mui/material';
import ToolboxItem from './ToolboxItem';

function Toolbox({ items }) {
  return (
    <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        ツールボックス
      </Typography>
      {items.map((item) => (
        <ToolboxItem key={item.type} type={item.type} label={item.label} />
      ))}
    </Box>
  );
}

export default Toolbox;