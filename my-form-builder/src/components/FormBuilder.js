import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Toolbox from './builder/Toolbox';
import Canvas from './builder/Canvas';

function FormBuilder({ toolboxItems, formComponents, onDrop, onMove, onUpdate }) {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        フォームビルダー
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Toolbox items={toolboxItems} />
        </Grid>
        <Grid item xs={9}>
          <Canvas
            components={formComponents}
            onDrop={onDrop}
            onMove={onMove}
            onUpdate={onUpdate}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FormBuilder;